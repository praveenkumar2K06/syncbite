import { useState, useEffect, useCallback, useRef, type FormEvent } from "react";
import {
  sendNotificationApi,
  getMyNotificationsApi,
  type NotificationResponse,
  type NotificationSendRequest,
} from "../api/admin";
import NotificationHeader from "./notifications/NotificationHeader";
import NotificationDispatchForm, {
  type TargetType,
  type DeliveryChannel,
} from "./notifications/NotificationDispatchForm";
import NotificationHistoryList from "./notifications/NotificationHistoryList";

interface NotificationsTabProps {
  onShowToast: (msg: string, type: "success" | "error") => void;
}

export default function NotificationsTab({ onShowToast }: NotificationsTabProps) {
  const [logs, setLogs] = useState<NotificationResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const loadRequestId = useRef(0);

  // Form State
  const [targetType, setTargetType] = useState<TargetType>("PLATFORM_BROADCAST");
  const [channel, setChannel] = useState<DeliveryChannel>("EMAIL");
  const [recipient, setRecipient] = useState("all-students@vitstudent.ac.in");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const loadNotifications = useCallback(async () => {
    const requestId = ++loadRequestId.current;
    setLoading(true);
    try {
      const data = await getMyNotificationsApi();
      if (Array.isArray(data)) {
        if (requestId === loadRequestId.current) setLogs(data);
      } else {
        if (requestId === loadRequestId.current) setLogs([]);
      }
    } catch {
      if (requestId === loadRequestId.current) {
        onShowToast("Could not load notification history.", "error");
      }
    } finally {
      if (requestId === loadRequestId.current) setLoading(false);
    }
  }, [onShowToast]);

  useEffect(() => {
    loadNotifications();
    return () => {
      loadRequestId.current += 1;
    };
  }, [loadNotifications]);

  const handleTargetChange = (val: TargetType) => {
    setTargetType(val);
    if (val === "ALL_CUSTOMERS") setRecipient("broadcast:customers");
    else if (val === "ALL_RESTAURANTS") setRecipient("broadcast:restaurants");
    else if (val === "PLATFORM_BROADCAST") setRecipient("broadcast:all");
    else setRecipient("");
  };

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!recipient.trim()) {
      onShowToast("Recipient address is required.", "error");
      return;
    }
    if (!subject.trim()) {
      onShowToast("Subject is required.", "error");
      return;
    }
    if (!body.trim()) {
      onShowToast("Notification message body is required.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const payload: NotificationSendRequest = {
        recipient: recipient.trim(),
        subject: subject.trim(),
        body: body.trim(),
        channel,
      };

      await sendNotificationApi(payload);
      await loadNotifications();
      onShowToast(`Notification dispatched successfully via ${channel}! ✓`, "success");
      setSubject("");
      setBody("");
    } catch {
      onShowToast("Failed to dispatch notification.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <NotificationHeader onRefresh={loadNotifications} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 flex flex-col gap-4">
          <NotificationDispatchForm
            targetType={targetType}
            onTargetChange={handleTargetChange}
            channel={channel}
            onChannelChange={setChannel}
            recipient={recipient}
            onRecipientChange={setRecipient}
            subject={subject}
            onSubjectChange={setSubject}
            body={body}
            onBodyChange={setBody}
            submitting={submitting}
            onSubmit={handleSend}
          />
        </div>

        <NotificationHistoryList loading={loading} logs={logs} />
      </div>
    </div>
  );
}
