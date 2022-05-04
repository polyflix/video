//todo remove mock user when gateway is available
import { createParamDecorator } from "@nestjs/common";

export const MockUser = createParamDecorator(() => {
    return {
        id: "b8d26a9a-af81-4cec-abf9-1bac3101c8d0",
        avatar: "https://minio.polyflix.dopolytech.fr/images/3064762e-1f23-48d1-a784-2082b8908515.jpg",
        displayName: "Toto",
        email: "toto@etu.umontpellier.fr",
        firstName: "Toto",
        isAccountActivated: true,
        lastName: "Titi",
        roles: ["STUDENT"]
    };
});
