import {
  BrowserMultiFormatReader,
  IScannerControls
} from "@zxing/browser";
import { BarcodeFormat, DecodeHintType } from "@zxing/library";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@components/ui/Button";
import { Card } from "@components/ui/Card";
import { Input } from "@components/ui/Input";
import { ConfettiBurst } from "@components/scan/ConfettiBurst";
import { useToast } from "@components/ui/Toast";
import { claimSticker, ClaimStickerResponse } from "@lib/claim";
import { useAuth } from "@lib/auth";
import { formatClaimedDate } from "@lib/format";
import { SCANNER_RESTART_DELAY } from "@lib/constants";

const hints = new Map<DecodeHintType, unknown>();
hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.QR_CODE]);

type ScannerState = "idle" | "scanning" | "paused";

export function ScanPage(): JSX.Element {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const processingRef = useRef(false);
  const lastCodeRef = useRef<string | null>(null);
  const handleRawResultRef = useRef<((raw: string) => Promise<boolean>) | null>(null);

  const [scannerState, setScannerState] = useState<ScannerState>("idle");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [lastResult, setLastResult] =
    useState<ClaimStickerResponse["claim"] | null>(null);
  const [manualCode, setManualCode] = useState("");
  const [manualSignature, setManualSignature] = useState("");
  const [processing, setProcessing] = useState(false);

  const { notify } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/", { replace: true });
    }
  }, [navigate, user]);

  const stopScanner = useCallback(() => {
    controlsRef.current?.stop();
    controlsRef.current = null;
    readerRef.current?.reset();
    setScannerState("paused");
  }, []);

  const startScanner = useCallback(async () => {
    if (!videoRef.current) {
      return;
    }

    setCameraError(null);
    setScannerState("scanning");
    lastCodeRef.current = null; // Reset duplicate check

    const reader =
      readerRef.current ?? new BrowserMultiFormatReader(hints);
    readerRef.current = reader;

    try {
      controlsRef.current = await reader.decodeFromVideoDevice(
        undefined,
        videoRef.current,
        async (result, error, controls) => {
          if (controls) {
            controlsRef.current = controls;
          }

          if (result && handleRawResultRef.current) {
            await handleRawResultRef.current(result.getText());
          } else if (error && error.name !== "NotFoundException") {
            setCameraError("Camera read error. Adjust angle or lighting.");
          }
        }
      );
    } catch (error) {
      console.error(error);
      setCameraError(
        "Unable to access camera. Grant permissions or use manual entry."
      );
      setScannerState("idle");
    }
  }, []);

  const handleRawResult = useCallback(
    async (raw: string): Promise<boolean> => {
      if (processingRef.current) return false;

      const parsed = parseScanValue(raw);
      if (!parsed) {
        notify({
          title: "Unrecognized QR",
          description: "That code does not look like an event sticker.",
          variant: "error"
        });
        return false;
      }

      // Duplicate prevention: check if this is the same code as last scan
      if (lastCodeRef.current === parsed.code) {
        return false;
      }

      processingRef.current = true;
      lastCodeRef.current = parsed.code;
      setProcessing(true);
      stopScanner();
      let succeeded = false;

      const queueRestart = () => {
        window.setTimeout(() => {
          void startScanner();
        }, SCANNER_RESTART_DELAY);
      };

      try {
        const response = await claimSticker(parsed);
        if (response.ok && response.claim) {
          setLastResult(response.claim);
          notify({
            title: "Sticker claimed!",
            description: response.claim.stickerName
              ? `${response.claim.stickerName} added to your collection.`
              : "Saved to your collection.",
            variant: "success"
          });
          succeeded = true;
        } else {
          const message = getClaimErrorMessage(response);
          notify({
            title: response.status === 409 ? "Already claimed" : "Claim blocked",
            description: message,
            variant: response.status === 409 ? "info" : "error"
          });
          queueRestart();
        }
      } catch (error) {
        console.error(error);
        const message =
          error instanceof Error ? error.message : "We could not reach the function. Try again.";
        notify({
          title: "Claim failed",
          description: message,
          variant: "error"
        });
        queueRestart();
      } finally {
        setProcessing(false);
        processingRef.current = false;
      }

      return succeeded;
    },
    [notify, startScanner, stopScanner]
  );

  // Keep ref up to date
  useEffect(() => {
    handleRawResultRef.current = handleRawResult;
  }, [handleRawResult]);

  // Start scanner on mount, stop on unmount
  useEffect(() => {
    void startScanner();
    return () => {
      stopScanner();
    };
  }, [startScanner, stopScanner]);

  // Pause scanner when page is hidden, resume when visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopScanner();
      } else if (scannerState === "paused") {
        void startScanner();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [scannerState, startScanner, stopScanner]);

  const handleManualSubmission = async () => {
    const payload = prepareManualPayload(manualCode, manualSignature);
    if (!payload) {
      notify({
        title: "Invalid input",
        description: "Enter the sticker code exactly as printed.",
        variant: "error"
      });
      return;
    }

    const query = new URLSearchParams({ code: payload.code });
    if (payload.sig) {
      query.set("sig", payload.sig);
    }
    const syntheticUrl = `https://manual-entry.local/scan?${query.toString()}`;
    const succeeded = await handleRawResult(syntheticUrl);
    if (succeeded) {
      setManualCode("");
      setManualSignature("");
    }
  };

  const statusCopy = useMemo(() => {
    if (processing) return "Claiming sticker…";
    if (scannerState === "scanning") return "Scanner active. Align the QR inside the frame.";
    if (scannerState === "paused") return "Paused. Scan again when ready.";
    return "Scanner idle.";
  }, [processing, scannerState]);

  return (
    <main className="relative mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-16">
      <section className="grid gap-8 lg:grid-cols-[minmax(0,_2fr)_minmax(0,_1fr)]">
        <Card className="relative overflow-hidden border-white/10 p-0">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-transparent to-transparent" />
          <div className="relative flex flex-col gap-6 p-6 lg:flex-row">
            <div className="flex-1 space-y-4">
              <header className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-200">
                  Scanner
                </p>
                <h1 className="text-3xl font-semibold text-white">
                  Claim your event stickers
                </h1>
                <p className="text-sm text-white/60">{statusCopy}</p>
                {cameraError ? (
                  <p className="text-sm font-medium text-danger">{cameraError}</p>
                ) : null}
              </header>
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/50">
                <video
                  ref={videoRef}
                  className="aspect-video w-full rounded-2xl object-cover"
                  muted
                  playsInline
                />
                <ConfettiBurst active={Boolean(lastResult)} />
                <div className="pointer-events-none absolute inset-0 border-2 border-dashed border-white/15" />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="secondary"
                  onClick={() => void startScanner()}
                  disabled={processing}
                >
                  {scannerState === "scanning" ? "Rescan" : "Activate camera"}
                </Button>
                <Button variant="ghost" onClick={() => stopScanner()}>
                  Pause
                </Button>
              </div>
            </div>
            <aside className="flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-white/10 bg-surface-muted/60 p-5">
              <h2 className="text-base font-semibold text-white">Manual entry</h2>
              <Input
                label="Sticker code"
                name="manual-code"
                value={manualCode}
                onChange={(event) => setManualCode(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !processing) {
                    void handleManualSubmission();
                  }
                }}
                placeholder="ABC123"
                autoCapitalize="characters"
                autoComplete="off"
              />
              <Input
                label="Signature (optional)"
                name="manual-sig"
                value={manualSignature}
                onChange={(event) => setManualSignature(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !processing) {
                    void handleManualSubmission();
                  }
                }}
                placeholder="If printed on the sticker"
                autoComplete="off"
              />
              <Button
                onClick={() => void handleManualSubmission()}
                loading={processing}
              >
                Submit code
              </Button>
              <p className="text-xs text-white/50">
                Manual entry uses the same secure function as the scanner. Codes are
                single-use. Already-claimed stickers return a clear message.
              </p>
            </aside>
          </div>
        </Card>
        <Card className="space-y-4 border-white/10">
          <header className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-200">
              Latest claim
            </p>
            <h2 className="text-2xl font-semibold text-white">
              {lastResult?.stickerName ?? "No sticker claimed yet"}
            </h2>
          </header>
          {lastResult ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-white/60">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-brand-200">
                  {lastResult.eventId}
                </span>
                {lastResult.stickerRarity ? (
                  <span className="text-xs font-semibold text-success">
                    {lastResult.stickerRarity}
                  </span>
                ) : null}
              </div>
              <dl className="space-y-2 text-sm text-white/70">
                <div className="flex items-center justify-between">
                  <dt className="text-white/50">Code</dt>
                  <dd className="font-mono text-sm text-white">{lastResult.code}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-white/50">Claimed at</dt>
                  <dd>{formatClaimedDate(lastResult.claimedAt)}</dd>
                </div>
              </dl>
              <Button
                variant="secondary"
                onClick={() => void startScanner()}
                className="w-full"
              >
                Scan another sticker
              </Button>
            </div>
          ) : (
            <p className="text-sm text-white/60">
              Your latest claim will appear here with code, rarity, and timestamp.
            </p>
          )}
        </Card>
      </section>
    </main>
  );
}

function parseScanValue(raw: string):
  | {
      code: string;
      sig?: string;
    }
  | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(trimmed);
    const code = parsed.searchParams.get("code");
    if (!code) return null;
    const sig = parsed.searchParams.get("sig") ?? undefined;
    return { code, sig };
  } catch {
    // Not a URL; treat as raw code
    return { code: trimmed };
  }
}

function prepareManualPayload(code: string, sig: string) {
  const trimmedCode = code.trim();
  if (!trimmedCode) return null;

  return {
    code: trimmedCode,
    sig: sig.trim() || undefined
  };
}

function getClaimErrorMessage(response: ClaimStickerResponse): string {
  if (response.error) return response.error;

  switch (response.status) {
    case 404:
      return "Invalid or inactive sticker.";
    case 409:
      return "Sticker already claimed.";
    default:
      return "Temporary error. Try again.";
  }
}
