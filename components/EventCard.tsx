"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useStorageUrl } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import {
  CalendarDays,
  Check,
  CircleArrowRight,
  LoaderCircle,
  MapPin,
  PencilIcon,
  StarIcon,
  Ticket,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PurchaseTicket from "./PurchaseTicket";

function EventCard({ eventId }: { eventId: Id<"events"> }) {
  const router = useRouter();
  const { user } = useUser();
  const event = useQuery(api.events.getById, { eventId });
  const availabilty = useQuery(api.events.getEventAvailability, { eventId });
  // we have to check if the user has bought a ticket or not
  const userTicket = useQuery(api.tickets.getUserTicketForEvent, {
    eventId,
    userId: user?.id ?? "",
  });
  const queuePostion = useQuery(api.waitingList.getQueuePosition, {
    eventId,
    userId: user?.id ?? "",
  });
  // get the images
  const imageUrl = useStorageUrl(event?.imageStorageId);

  if (!event || !availabilty) {
    return null;
  }
  const isPastEvent = event.eventDate < Date.now();
  const isEventOwner = user?.id === event.userId;
  const redirectToEditPage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    router.push(`/seller/events/${eventId}/edit`);
  };
  const renderQueuePostion = () => {
    if (!queuePostion || queuePostion.status !== "waiting") return null;
    if (availabilty.purchasedCount >= availabilty.totalTickets) {
      return (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Ticket className="w-5 h-5 text-gray-600 mr-2" />
            <span className="text-gray-600">Event is sold out </span>
          </div>
        </div>
      );
    }
    if (queuePostion.position === 2) {
      return (
        <div className="flex flex-col lg:flex-row items-center justify-between p-3 bg-amber-50 rounded-lg boder border-amber-100">
          <div className="flex items-center">
            <CircleArrowRight className="w-5 h-5 text-amber-500 mr-2" />
            <span className="text-amber-700 font-medium">
              You&apos;re next in line{" "}
            </span>
          </div>
          <div className="flex items-center">
            <LoaderCircle className="w-4 h-4 mr-1 animate-spin text-amber-500" />
            <span className="text-amber-600 text-sm">Waiting for ticket!</span>
          </div>
        </div>
      );
    }
  };
  const renderTicketStatus = () => {
    if (!user) return null;
    if (isEventOwner) {
      return (
        <div className="mt-4">
          <button
            className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 shadow-sm flex items-center justify-center gap-2"
            onClick={redirectToEditPage}
          >
            <PencilIcon className="w-5 h-5" />
            <span>Edit Event</span>
          </button>
        </div>
      );
    }
    if (userTicket) {
      return (
        <div className="mt-4 flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
          <div className="flex items-center">
            <Check className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-700 font-md">You have a ticket</span>
          </div>
          <button
            onClick={() => router.push(`/tickets/${userTicket._id}`)}
            className="text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-full font-medium shadow-sm transition-colors duration-200 flex items-center gap-1"
          >
            View your ticket
          </button>
        </div>
      );
    }
    if (queuePostion) {
      return (
        <div className="mt-4">
          {queuePostion.status === "offered" && (
            <PurchaseTicket eventId={eventId} />
          )}
          {renderQueuePostion()}
          {queuePostion.status === "expired" && (
            <div className="p-3 bg-red-50 rounded-lg border border-red-100">
              <span>
                <XCircle className="w-5 h-5 mr-2" />
                Offer expired
              </span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };
  return (
    <div
      onClick={() => router.push(`/event/${eventId}`)}
      className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 cursor-pointer overflow-hidden relative ${isPastEvent ? "opacity-75 hover:opacity-100" : ""}`}
    >
      {/* event image */}
      {imageUrl && (
        <div className="relative w-full h-48">
          <Image
            src={imageUrl}
            alt={event.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}
      {/* event details */}
      <div className={`p-6 ${imageUrl ? "relative" : ""}`}>
        <div className="flex justify-between items-start">
          {/* event name and the owner badge */}
          <div>
            <div className="flex flex-col items-start gap-2">
              {isEventOwner && (
                <span className="inline-flex items-center gap-1 bg-blue-600/90 text-white text-xs px-2 py-1 rounded-full font-medium">
                  <StarIcon className="w-3 h-3" />
                  Your Event
                </span>
              )}
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
                {event.name}
              </h2>
            </div>
            {isPastEvent && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mt-2">
                Past Event
              </span>
            )}
          </div>

          {/* price tag */}
          <div className="flex flex-col items-end gap-2 ml-4">
            <span
              className={`px-4 py-1.5 font-semibold rounded-full ${isPastEvent ? "bg-gray-50 text-gray-500" : "bg-green-50 text-green-700"}`}
            >
              ￡{event.price.toFixed(2)}
            </span>
            {availabilty.purchasedCount >= availabilty.totalTickets && (
              <span className="bg-red-50 text-red-700 font-semibold px-4 py-1.5 text-sm">
                Sold Out
              </span>
            )}
          </div>
        </div>
        {/* event details */}
        <div className="mt-4 space-y-3">
          {/* location */}
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{event.location}</span>
          </div>
          {/* date */}
          <div className="flex items-center gap-2 text-gray-600">
            <CalendarDays className="w-4 h-4" />
            <span>
              {new Date(event.eventDate).toLocaleDateString()}{" "}
              {isPastEvent && "Ended"}
            </span>
          </div>
          {/* ticket availability */}
          <div className="flex items-center gap-2 text-gray-600">
            <Ticket className="w-4 h-4" />
            <span>
              {availabilty.totalTickets - availabilty.purchasedCount} /{" "}
              {availabilty.totalTickets} Available
              {!isPastEvent && availabilty.activeOffers > 0 && (
                <span className="text-amber-600 text-sm ml-2">
                  ({availabilty.activeOffers}{" "}
                  {availabilty.activeOffers === 1 ? "person" : "people"} trying
                  to buy)
                </span>
              )}
            </span>
          </div>
          {/* event desc */}
          <p className="text-gray-600 text-sm mt-4 line-clamp-2">
            {event.description}
          </p>
          {/* ticket status  */}
          <div onClick={(e) => e.stopPropagation()}>
            {!isPastEvent && renderTicketStatus()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventCard;
