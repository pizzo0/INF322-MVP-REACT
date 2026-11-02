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

## DEPENDENCIAS

- [Docker](https://www.docker.com/)
- npm o bun (opcional, es mas que nada para ver el codigo sin errores instalando las dependencias)

## URLs

- React: http://localhost:8080/
