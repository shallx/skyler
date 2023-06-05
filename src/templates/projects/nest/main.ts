import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { ValidationPipe } from "@nestjs/common"

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true, // Does not allows values to pass to api that are not present in dto
    })) // To Globaly use validation logic everywhere
    await app.listen(3001)
}
bootstrap()
