import { apiGetCall, secureApiDeleteCall, secureApiPostCall, secureApiPutCall } from "./api-call";
import { GlobalService, MainService, NewMainService, NewSubService, SubService } from "./model";

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
	const response = await secureApiPostCall('http://localhost:8080/services', JSON.stringify(mainService), token);
	return response.data;
};

export const updateService = async (mainService: MainService, token: string): Promise<MainService> => {
	const response = await secureApiPutCall('http://localhost:8080/services/'+mainService.id.toString(), JSON.stringify(mainService), token);
	return response.data;
};

export const deleteService = async (mainServiceId: number, token: string) => {
	await secureApiDeleteCall('http://localhost:8080/services/'+mainServiceId.toString(), token);
};

export const getSubServicesByMainServiceId = async (mainServiceId: number): Promise<Array<SubService>> => {
	const response = await apiGetCall(`http://localhost:8080/subServices/mainService/${mainServiceId.toString()}`);
	return response.data;
};

export const createSubService = async (subService: NewSubService, mainServiceId: number, token: string): Promise<SubService> => {
	console.log(JSON.stringify(subService))
	const response = await secureApiPostCall('http://localhost:8080/subServices/' + mainServiceId.toString(), JSON.stringify(subService), token);
	return response.data;
};

export const updateSubService = async (subService: SubService, token: string): Promise<MainService> => {
	const response = await secureApiPutCall('http://localhost:8080/subServices/'+subService.id.toString(), JSON.stringify(subService), token);
	return response.data;
};

export const deleteSubService = async (subServiceId: number, token: string) => {
	await secureApiDeleteCall('http://localhost:8080/subServices/'+subServiceId.toString(), token);
};