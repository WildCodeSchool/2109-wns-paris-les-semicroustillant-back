# Instructions

Front and back folders have to be in the same parent folder.
They must match the exact following names.

## Name of repositories

### Back-end folder
`2109-wns-paris-les-semicroustillant-back`

### Front-end folder
`2109-wns-paris-les-semicroustillant-front`

## Build images with docker-compose on development environment
In `2109-wns-paris-les-semicroustillant-back` folder, run the following command:

```bash
docker-compose -f docker-compose.dev.yml up --build
```
## Build images with docker-compose on production environment
In `2109-wns-paris-les-semicroustillant-back` folder, run the following command:

```bash
docker-compose -f docker-compose.prod.yml up --build
```

## Connection Port
### Back-end
`http://localhost:5050/`

### Front-end
`http://localhost:8080/`