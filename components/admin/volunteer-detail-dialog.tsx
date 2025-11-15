// components/admin/volunteer-detail-dialog.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VolunteerSubmission, VolunteerStatus } from "@/types/volunteer";
import { format } from "date-fns";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface VolunteerDetailDialogProps {
  volunteer: VolunteerSubmission | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusUpdate?: (id: string, status: VolunteerStatus) => void;
}

export function VolunteerDetailDialog({
  volunteer,
  open,
  onOpenChange,
  onStatusUpdate,
}: VolunteerDetailDialogProps) {
  if (!volunteer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        data-testid="volunteer-detail-dialog"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl">{volunteer.name}</DialogTitle>
          <DialogDescription>
            Application submitted {format(new Date(volunteer.createdAt), "PPP")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status</span>
            <Badge
              variant={
                volunteer.status === VolunteerStatus.APPROVED
                  ? "default"
                  : "secondary"
              }
              data-testid="volunteer-detail-status"
            >
              {volunteer.status}
            </Badge>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Contact Information</h3>
            <div className="grid gap-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a
                  href={`mailto:${volunteer.email}`}
                  className="text-primary hover:underline"
                  data-testid="volunteer-detail-email"
                >
                  {volunteer.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a
                  href={`tel:${volunteer.phone}`}
                  className="text-primary hover:underline"
                  data-testid="volunteer-detail-phone"
                >
                  {volunteer.phone}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span data-testid="volunteer-detail-location">
                  {volunteer.state}, {volunteer.country}
                </span>
              </div>
            </div>
          </div>

          {/* Volunteer Capacity */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Volunteer Capacity</h3>
            <Badge variant="outline" data-testid="volunteer-detail-capacity">
              {volunteer.capacity.replace(/_/g, " ")}
            </Badge>
          </div>

          {/* Additional Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">How They Can Help</h3>
            <p
              className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-md"
              data-testid="volunteer-detail-additional-help"
            >
              {volunteer.additionalHelp}
            </p>
          </div>

          {/* Communication Preferences */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Communication Preferences</h3>
            <div className="flex items-center gap-2">
              {volunteer.receiveUpdates ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <span className="text-sm">
                {volunteer.receiveUpdates
                  ? "Opted in to receive updates"
                  : "Not opted in to receive updates"}
              </span>
            </div>
          </div>

          {/* Timestamps */}
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                Submitted: {format(new Date(volunteer.createdAt), "PPP")}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                Last Updated: {format(new Date(volunteer.updatedAt), "PPP")}
              </span>
            </div>
          </div>

          {/* Actions */}
          {onStatusUpdate && (
            <div className="flex gap-2 pt-4 border-t">
              {volunteer.status === VolunteerStatus.PENDING && (
                <>
                  <Button
                    onClick={() =>
                      onStatusUpdate(volunteer.id, VolunteerStatus.APPROVED)
                    }
                    className="flex-1"
                    data-testid="approve-button"
                  >
                    Approve
                  </Button>
                  <Button
                    onClick={() =>
                      onStatusUpdate(volunteer.id, VolunteerStatus.DECLINED)
                    }
                    variant="destructive"
                    className="flex-1"
                    data-testid="decline-button"
                  >
                    Decline
                  </Button>
                </>
              )}
              {volunteer.status === VolunteerStatus.APPROVED && (
                <Button
                  onClick={() =>
                    onStatusUpdate(volunteer.id, VolunteerStatus.CONTACTED)
                  }
                  className="flex-1"
                  data-testid="mark-contacted-button"
                >
                  Mark as Contacted
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
