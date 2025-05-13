
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { absenceService, Absence } from "@/services/absenceService";
import { format, parseISO, differenceInDays } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

interface AbsenceApprovalDialogProps {
  open: boolean;
  onClose: (refetch?: boolean) => void;
  absence: Absence | null;
}

const AbsenceApprovalDialog: React.FC<AbsenceApprovalDialogProps> = ({
  open,
  onClose,
  absence,
}) => {
  const [loading, setLoading] = useState(false);
  const [adminComment, setAdminComment] = useState("");

  if (!absence) return null;

  const handleApprove = async () => {
    if (!absence) return;

    try {
      setLoading(true);
      await absenceService.approveAbsence(absence.id);
      toast.success("Ausencia aprobada correctamente");
      onClose(true);
    } catch (error) {
      console.error("Error approving absence:", error);
      toast.error("Error al aprobar la ausencia");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!absence) return;

    try {
      setLoading(true);
      await absenceService.rejectAbsence(absence.id);
      toast.success("Ausencia rechazada correctamente");
      onClose(true);
    } catch (error) {
      console.error("Error rejecting absence:", error);
      toast.error("Error al rechazar la ausencia");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return format(parseISO(dateStr), "dd 'de' MMMM 'de' yyyy", { locale: es });
  };

  const getDuration = (startDate: string, endDate: string) => {
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    const days = differenceInDays(end, start) + 1;
    return days === 1 ? "1 día" : `${days} días`;
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Revisar Solicitud de Ausencia</DialogTitle>
          <DialogDescription>
            Revisar y aprobar o rechazar la solicitud de ausencia.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Solicitante</h4>
              <p>{absence.profile?.full_name || "Usuario"}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Departamento</h4>
              <p>{absence.profile?.department || "-"}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Tipo</h4>
              <p>{absence.absence_type?.name || "Ausencia"}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Estado</h4>
              <p className={`font-medium ${
                absence.status === "approved" ? "text-green-600" :
                absence.status === "rejected" ? "text-red-600" :
                absence.status === "cancelled" ? "text-gray-600" :
                "text-amber-600"
              }`}>
                {absence.status === "approved" ? "Aprobado" :
                 absence.status === "rejected" ? "Rechazado" :
                 absence.status === "cancelled" ? "Cancelado" :
                 "Pendiente"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Fecha inicio</h4>
              <p>{formatDate(absence.start_date)}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Fecha fin</h4>
              <p>{formatDate(absence.end_date)}</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500">Duración</h4>
            <p>{getDuration(absence.start_date, absence.end_date)}
              {absence.half_day ? " (Medio día)" : ""}
            </p>
          </div>

          {absence.comment && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">Comentarios del empleado</h4>
              <p className="text-sm text-gray-700">{absence.comment}</p>
            </div>
          )}

          {absence.status === "pending" && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">Comentarios (opcional)</h4>
              <Textarea
                placeholder="Añadir comentarios..."
                value={adminComment}
                onChange={(e) => setAdminComment(e.target.value)}
                className="mt-1"
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onClose()}
          >
            Cerrar
          </Button>
          
          {absence.status === "pending" && (
            <>
              <Button 
                variant="destructive" 
                onClick={handleReject}
                disabled={loading}
              >
                Rechazar
              </Button>
              <Button 
                onClick={handleApprove}
                disabled={loading}
              >
                Aprobar
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AbsenceApprovalDialog;
