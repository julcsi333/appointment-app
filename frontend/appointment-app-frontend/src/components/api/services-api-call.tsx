import { apiGetCall, secureApiPostCall, secureApiPutCall } from "./api-call";
import { GlobalService, MainService, NewMainService } from "./model";

export const getAllGlobalServices = async (): Promise<Array<GlobalService>> => {
	const response = await apiGetCall('http://localhost:8080/globalServices');
	return response.data;
};

export const getAllServices = async (): Promise<Array<MainService>> => {
	const response = await apiGetCall('http://localhost:8080/services');
	return response.data;
};

export const getServiceById = async (id: string): Promise<MainService> => {
	const response = await apiGetCall(`http://localhost:8080/services/${id}`);
	return response.data;
};

export const getServicesByProviderId = async (id: string): Promise<Array<MainService>> => {
	const response = await apiGetCall(`http://localhost:8080/services/provider/${id}`);
	return response.data;
};

export const createService = async (mainService: NewMainService, token: string): Promise<MainService> => {
	console.log(JSON.stringify(mainService))
	const response = await secureApiPostCall('http://localhost:8080/services', JSON.stringify(mainService), token);
	return response.data;
};

export const updateProvider = async (mainService: MainService, token: string): Promise<MainService> => {
	const response = await secureApiPutCall('http://localhost:8080/services/'+mainService.id.toString(), JSON.stringify(mainService), token);
	return response.data;
};