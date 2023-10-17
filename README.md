# BackEnd-Universal

## 1° Passo

Ter o Node instalado em sua maquina
```sh
C:\Users\natha>node --version
v18.16.1
```

Ter o Docker Instalado em sua maquina

## 2° Passo
Na pasta do projeto
```sh
cd back
```

## 3° Passo
Rodar o comando
```sh
docker-compose up -d
```

## 4° Passo
Rodar o comando
```sh
npx prisma migrate dev --name init
```

## 5° Passo
Rodar o comando
```sh
npx prisma generate
```

## 6° Passo
Rodar o comando
```sh
npm run start
```

## 7° Passo (Opcional)
Rodar o comando em outro terminal
```sh
npx prisma studio
```

