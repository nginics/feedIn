export default class ApiResponse {
    private response: {success: boolean, message: string, [key: string]: any};
    private statusCode: number;

    constructor(success: boolean, message: string, statusCode: number){
        this.response = {success, message};
        this.statusCode = statusCode;
    }

    add(key: string, value: any): this{
        this.response[key] = value;
        return this
    }

    send(): Response{
        return new Response(JSON.stringify(this.response), {status: this.statusCode});
    }
}