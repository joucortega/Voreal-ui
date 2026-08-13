"use client";

import { useId, useState, type ChangeEvent, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../utilities/cn";

export type FileRejectionReason = "count" | "size" | "type";

export type FileRejection = {
  file: File;
  reasons: FileRejectionReason[];
};

export type FileUploadProps = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "size" | "type"> & {
  description?: ReactNode;
  label: ReactNode;
  maxFiles?: number;
  maxSize?: number;
  onAcceptedFiles?: (files: File[]) => void;
  onRejectedFiles?: (rejections: FileRejection[]) => void;
};

function matchesAccept(file: File, accept?: string): boolean {
  if (!accept) return true;
  return accept.split(",").some((rawRule) => {
    const rule = rawRule.trim().toLocaleLowerCase();
    const fileType = file.type.toLocaleLowerCase();
    const fileName = file.name.toLocaleLowerCase();
    if (rule.startsWith(".")) return fileName.endsWith(rule);
    if (rule.endsWith("/*")) return fileType.startsWith(rule.slice(0, -1));
    return fileType === rule;
  });
}

export function FileUpload({
  accept,
  className,
  description = "Selecciona archivos desde tu dispositivo. La carga comienza solo cuando confirmas el formulario.",
  disabled,
  id,
  label,
  maxFiles = Number.POSITIVE_INFINITY,
  maxSize = Number.POSITIVE_INFINITY,
  multiple = true,
  onAcceptedFiles,
  onRejectedFiles,
  ...props
}: FileUploadProps) {
  const reactId = useId().replaceAll(":", "");
  const inputId = id ?? `vr-file-upload-${reactId}`;
  const labelId = `${inputId}-label`;
  const descriptionId = `${inputId}-description`;
  const [summary, setSummary] = useState("");

  function validate(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    const accepted: File[] = [];
    const rejected: FileRejection[] = [];

    files.forEach((file, index) => {
      const reasons: FileRejectionReason[] = [];
      if (index >= maxFiles) reasons.push("count");
      if (!matchesAccept(file, accept)) reasons.push("type");
      if (file.size > maxSize) reasons.push("size");
      if (reasons.length > 0) rejected.push({ file, reasons });
      else accepted.push(file);
    });

    onAcceptedFiles?.(accepted);
    onRejectedFiles?.(rejected);
    setSummary(
      rejected.length > 0
        ? `${accepted.length} aceptados, ${rejected.length} rechazados`
        : `${accepted.length} ${accepted.length === 1 ? "archivo seleccionado" : "archivos seleccionados"}`,
    );
  }

  return (
    <div className={cn("vr-file-upload", className)} data-disabled={disabled ? "true" : undefined}>
      <input
        {...props}
        accept={accept}
        aria-describedby={descriptionId}
        aria-labelledby={labelId}
        className="vr-file-upload__input"
        disabled={disabled}
        id={inputId}
        multiple={multiple}
        onChange={validate}
        type="file"
      />
      <label className="vr-file-upload__surface" htmlFor={inputId}>
        <span aria-hidden="true" className="vr-file-upload__mark">＋</span>
        <strong id={labelId}>{label}</strong>
        <span className="vr-file-upload__description" id={descriptionId}>{description}</span>
      </label>
      <span aria-live="polite" className="vr-file-upload__status" role="status">{summary}</span>
    </div>
  );
}
