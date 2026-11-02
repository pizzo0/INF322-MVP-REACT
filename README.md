# INF322-MVP-REACT (USM Denuncia)

Proyecto construido con [Lovable](https://lovable.dev).

## INTEGRANTES

- Alejandro Cáceres
- Benjamin Caro
- Cristobal Barahona


> [!NOTE]
> Trabajamos en conjunto en la pagina Lovable, solo que no pudimos configurar bien la cuenta de GitHub en la pagina para que muestre correctamente quién hizo que cosa.

## INSTRUCCIONES

> [!NOTE]
> Todo fue testeado en `WSL Fedora`.

Para construir el contenedor:
```bash
docker compose build
```

Para levantar el contenedor (una vez ya construido):
```bash
docker compose up
```

o si quieres construirlo y levantarlo:

```bash
docker compose up --build
```

Para levantarlo en segundo plano, sin ver los logs del contenedor:
```bash
docker compose up -d
```

Para detener el contenedor:
```bash
docker compose stop
```

Para detener y eliminar el contenedor, junto con su red creada:
```bash
docker compose down
```

Para detener y eliminar el contenedor, junto con su red creada y volumen asociado, en caso de ser necesario:
```bash
docker compose down -v
```

> [!IMPORTANT]  
> En windows, `Docker Desktop` debe estar abierto para que todo funcione como corresponde.

> [!IMPORTANT]  
> En windows, el comando probablemente es `docker-compose`.

### INSTRUCCIONES SIN DOCKER

Si no quieres usar docker y prefieres usar directamente npm o bun, primero instala las dependencias:

```bash
npm install
# o con bun
bun install
```

y luego ya puedes correr el proyecto (no es necesario volver a instalar dependencias si quieres volver a correrlo):

```bash
npm run dev
# o con bun
bun run dev
```

> [!NOTE]
> Si te da problemas npm al instalar dependencias, puedes usar `npm install --legacy-peer-deps`.
>
> Por eso igual recomendamos mas usar docker, o usar bun porque es el que usa lovable

## DEPENDENCIAS

- [Docker](https://www.docker.com/)
- npm o bun (opcional, es mas que nada para ver el codigo sin errores instalando las dependencias)

## URLs

- React: http://localhost:8080/

### Pruebas Unitarias (Tests)
Para ejecutar la suite de pruebas automatizadas con Vitest (32 tests que validan la lógica de negocio y las 3 metas de usuario):
```bash
npm run test
# o si usas bun:
bun test
```
