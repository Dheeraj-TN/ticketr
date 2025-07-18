"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Spinner from "./Spinner";
import { CalendarDays, Ticket } from "lucide-react";
import EventCard from "./EventCard";

function EventList() {
  const events = useQuery(api.events.get);
  //   console.log("Events are:", events);

  if (!events) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }
  const upcomingEvents = events
    .filter((event) => event.eventDate > Date.now())
    .sort((a, b) => a.eventDate - b.eventDate);
  const pastEvents = events
    .filter((event) => event.eventDate <= Date.now())
    .sort((a, b) => b.eventDate - a.eventDate);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ">
      {/* header component of the event list  */}
      <div className="flex flex-col lg:flex-row items-start gap-y-4 lg:gap-y-0 lg:items-center justify-between mb-8">
        <div className="flex flex-col items-start justify-center">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Upcoming Events
          </h1>
          <p className="mt-2 text-gray-600 text-md lg:text-lg">
            Discover & book amazing tickets for amazing events
          </p>
        </div>
        <div className="bg-white px-1 lg:px-4 py-2 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <CalendarDays className="w-5 h-5" />
            <span>{upcomingEvents.length} Upcoming Events</span>
          </div>
        </div>
      </div>
      {/* upcoming events grid */}
      {upcomingEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {upcomingEvents.map((event) => (
            <EventCard key={event._id} eventId={event._id} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-12 text-center mb-12">
          <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">
            No Upcoming Events
          </h3>
          <p className="text-gray-600 mt-1">Check back later for new events</p>
        </div>
      )}
      {/* past events */}
      <div className="flex flex-col lg:flex-row items-start gap-y-4 lg:gap-y-0 lg:items-center justify-between mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
          Past Events
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {pastEvents.map((event) => (
          <EventCard key={event._id} eventId={event._id} />
        ))}
      </div>
    </div>
  );
}

export default EventList;
