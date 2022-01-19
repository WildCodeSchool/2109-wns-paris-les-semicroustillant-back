# Instructions

Front and back folders have to be in the same parent folder.
They must match the exact following names.

## Name of repositories

### Back-end folder
`2109-wns-paris-les-semicroustillant-back`

### Front-end folder
`2109-wns-paris-les-semicroustillant-front`

## Build images with docker-compose
## In 2109-wns-paris-les-semicroustillant-back folder
```bash
docker-compose -f docker-compose.dev.yml up --build
```

## Connection Port
### Back-end
`http://localhost:5050/`

### Front-end
`http://localhost:8080/`