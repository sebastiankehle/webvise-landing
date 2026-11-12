/** What a discovery call can be about. The keys travel in the booking URL
 * and map to `book.topics` in the message files. */
export const BOOKING_TOPICS = [
	"website",
	"software",
	"automation",
	"unsure",
] as const;
export type BookingTopic = (typeof BOOKING_TOPICS)[number];

export function isBookingTopic(value: unknown): value is BookingTopic {
	return BOOKING_TOPICS.includes(value as BookingTopic);
}
