
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { absenceService, AbsenceType } from "@/services/absenceService";
import { CalendarDateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { format, addDays } from "date-fns";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const formSchema = z.object({
  type_id: z.string({
    required_error: "Debes seleccionar un tipo de ausencia",
  }),
  date_range: z.object({
    from: z.date({
      required_error: "La fecha de inicio es requerida",
    }),
    to: z.date({
      required_error: "La fecha de fin es requerida",
    }),
  }),
  half_day: z.boolean().optional(),
  comment: z.string().optional(),
});

interface AbsenceRequestDialogProps {
  open: boolean;
  onClose: (refetch?: boolean) => void;
}

const AbsenceRequestDialog: React.FC<AbsenceRequestDialogProps> = ({
  open,
  onClose,
}) => {
  const { user } = useAuth();
  const [absenceTypes, setAbsenceTypes] = useState<AbsenceType[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type_id: "",
      date_range: {
        from: new Date(),
        to: addDays(new Date(), 1),
      },
      half_day: false,
      comment: "",
    },
  });

  useEffect(() => {
    if (open) {
      loadAbsenceTypes();
    }
  }, [open]);

  const loadAbsenceTypes = async () => {
    try {
      const types = await absenceService.getAbsenceTypes();
      setAbsenceTypes(types);
    } catch (error) {
      console.error("Error loading absence types:", error);
      toast.error("Error al cargar los tipos de ausencia");
    }
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;

    try {
      setLoading(true);

      await absenceService.requestAbsence(user.id, {
        type_id: values.type_id,
        start_date: format(values.date_range.from, "yyyy-MM-dd"),
        end_date: format(values.date_range.to, "yyyy-MM-dd"),
        half_day: values.half_day,
        comment: values.comment,
      });

      toast.success("Solicitud de ausencia enviada correctamente");
      onClose(true);
    } catch (error) {
      console.error("Error requesting absence:", error);
      toast.error("Error al enviar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Solicitud de Ausencia</DialogTitle>
          <DialogDescription>
            Complete el formulario para solicitar una ausencia o permiso.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Ausencia</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un tipo de ausencia" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {absenceTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date_range"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Periodo</FormLabel>
                  <FormControl>
                    <CalendarDateRangePicker
                      date={field.value as DateRange}
                      setDate={(range: DateRange) => field.onChange(range)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="half_day"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Medio día</FormLabel>
                    <FormDescription>
                      Marque esta opción si solo necesita ausentarse medio día.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comentarios (opcional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Detalles adicionales..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Enviando..." : "Enviar Solicitud"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AbsenceRequestDialog;
