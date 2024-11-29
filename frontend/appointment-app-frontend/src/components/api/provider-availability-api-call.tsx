import { getBaseUrl } from "../../config/config";
import { apiGetCall, secureApiDeleteCall, secureApiPostCall, secureApiPutCall } from "./api-call";
import { Availability, AvailabilityRule, BookableTime, Provider } from "./model";

function getAvailabilityUrl(providerId: number) {
	return `${getBaseUrl()}/providers/${providerId}/availability`
}


export const getBookableTimesByProviderId = async (id: number, bookTime: number): Promise<BookableTime[]> => {
	const response = await apiGetCall(`${getAvailabilityUrl(id)}/bookable?bookTime=${bookTime}`);
	return response.data;
};

export const getAvailabilityByProviderId = async (id: number): Promise<Availability[]> => {
	const response = await apiGetCall(getAvailabilityUrl(id));
	return response.data;
};

export const createAvailability = async (availability: Availability, token: string): Promise<Availability> => {
	const response = await secureApiPostCall(getAvailabilityUrl(availability.providerId), JSON.stringify(availability), token);
	return response.data;
};

export const createAvailabilityRule = async (availabilityRule: AvailabilityRule, token: string): Promise<AvailabilityRule> => {
	const response = await secureApiPostCall(`${getAvailabilityUrl(availabilityRule.providerId)}/rule`, JSON.stringify(availabilityRule), token);
	return response.data;
};

export const updateAvailability = async (availability: Availability, token: string): Promise<Availability> => {
	const response = await secureApiPutCall(`${getAvailabilityUrl(availability.providerId)}/${availability.id}`, JSON.stringify(availability), token);
	return response.data;
};

export const updateAvailabilityRule = async (availability: AvailabilityRule, token: string): Promise<AvailabilityRule> => {
	const response = await secureApiPutCall(`${getAvailabilityUrl(availability.providerId)}/rule/${availability.id}`, JSON.stringify(availability), token);
	return response.data;
};

export const deleteAvailability = async (providerId: number, availabilityId: number, token: string) => {
	await secureApiDeleteCall(`${getAvailabilityUrl(providerId)}/${availabilityId}`, token);
};

export const deleteAvailabilityRule = async (providerId: number, availabilityRuleId: number, token: string) => {
	await secureApiDeleteCall(`${getAvailabilityUrl(providerId)}/rule/${availabilityRuleId}`, token);
};