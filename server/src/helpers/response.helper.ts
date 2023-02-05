export const response = (status: number = 200, message: any = '', data: any = []) => ({
	status: status,
	message: message,
	data: data
});
