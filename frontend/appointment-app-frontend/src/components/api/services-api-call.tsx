import { getBaseUrl } from "../../config";
import { apiGetCall, secureApiDeleteCall, secureApiPostCall, secureApiPutCall } from "./api-call";
import { GlobalService, MainService, NewMainService, NewSubService, SubService } from "./model";

export const getAllGlobalServices = async (): Promise<Array<GlobalService>> => {
	const response = await apiGetCall(getBaseUrl() + '/globalServices');
	return response.data;
};

export const getAllServices = async (): Promise<Array<MainService>> => {
	const response = await apiGetCall(getBaseUrl() + '/services');
	return response.data;
};

export const getServiceById = async (id: string): Promise<MainService> => {
	const response = await apiGetCall(`${getBaseUrl()}/services/${id}`);
	return response.data;
};

export const getServicesByProviderId = async (id: string): Promise<Array<MainService>> => {
	const response = await apiGetCall(`${getBaseUrl()}/services/provider/${id}`);
	return response.data;
};

export const createService = async (mainService: NewMainService, token: string): Promise<MainService> => {
	const response = await secureApiPostCall(getBaseUrl() + '/services', JSON.stringify(mainService), token);
	return response.data;
};

export const updateService = async (mainService: MainService, token: string): Promise<MainService> => {
	const response = await secureApiPutCall(getBaseUrl() + '/services/' + mainService.id.toString(), JSON.stringify(mainService), token);
	return response.data;
};

export const deleteService = async (mainServiceId: number, token: string) => {
	await secureApiDeleteCall(getBaseUrl() + '/services/' + mainServiceId.toString(), token);
};

export const getSubServicesByMainServiceId = async (mainServiceId: number): Promise<Array<SubService>> => {
	const response = await apiGetCall(`${getBaseUrl()}/subServices/mainService/${mainServiceId.toString()}`);
	return response.data;
};

export const createSubService = async (subService: NewSubService, mainServiceId: number, token: string): Promise<SubService> => {
	const response = await secureApiPostCall(getBaseUrl() + '/subServices/' + mainServiceId.toString(), JSON.stringify(subService), token);
	return response.data;
};

export const updateSubService = async (subService: SubService, token: string): Promise<MainService> => {
	const response = await secureApiPutCall(getBaseUrl() + '/subServices/'+subService.id.toString(), JSON.stringify(subService), token);
	return response.data;
};

export const deleteSubService = async (subServiceId: number, token: string) => {
	await secureApiDeleteCall(getBaseUrl() + '/subServices/'+subServiceId.toString(), token);
};