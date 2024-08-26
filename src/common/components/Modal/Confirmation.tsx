import { ModalProps } from "antd";
import { Info } from "lucide-react";
import { MouseEvent, memo, useCallback, useState } from "react";
import { useIntl } from "react-intl";
import { twMerge } from "tailwind-merge";

import Modal from "./Modal";

interface ConfirmationModalProps extends ModalProps {
  status?: "success" | "error";
  message?: string;
  onOk?: (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void | Promise<void>;
}

const ConfirmationModal = ({
  status = "error",
  title,
  message,
  okText,
  onOk,
  ...props
}: ConfirmationModalProps) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [, setConfirmError] = useState<unknown>(null);

  const { formatMessage } = useIntl();

  const handleConfirm = useCallback(
    async (event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
      setConfirmLoading(true);

      try {
        await onOk?.(event);
      } catch (error) {
        setConfirmError(error);
      } finally {
        setConfirmLoading(false);
      }
    },
    [onOk],
  );

  return (
    <Modal
      confirmLoading={confirmLoading}
      showHeader={false}
      okText={okText ?? formatMessage({ id: "confirm" })}
      onOk={handleConfirm}
      {...props}
    >
      <div className="flex w-screen-sm flex-col items-center justify-center space-y-6 px-10 pb-8 pt-10">
        <div className="relative h-20 w-20 overflow-hidden rounded-full">
          <div
            className={twMerge(
              "absolute inset-0 rounded-full",
              status === "error" && "bg-primary bg-opacity-10",
            )}
          />
          <div
            className={twMerge(
              "absolute inset-2.5 rounded-full",
              status === "error" && "bg-primary bg-opacity-20",
            )}
          />
          <div
            className={twMerge(
              "absolute inset-2.5 flex items-center justify-center rounded-full",
              status === "error" && "text-primary",
            )}
          >
            <Info size={34} />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <div className="text-base font-semibold">{title}</div>
          <div className="text-message">{message}</div>
        </div>
      </div>
    </Modal>
  );
};

export default memo(ConfirmationModal);
