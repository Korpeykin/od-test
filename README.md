<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```



Для запуска программы необходимо создать в корне приложения файл .env и заполнитье его данными, приведенными в example.env.
Все таблицы создадуться самостоятельно.
# Поля example.env
```code
JWT_SECRET=секретный код авторизации
JWT_EXPIRATION_TIME=время жизни аксесс токена, указывать числом в милисекундах

PG_HOST=хост постгрика
PG_PORT=порт постгрика
PG_USERNAME=
PG_PASSWORD=
PG_DATABASE=

SALT_ROUNDS=хеширование пароля
```
## Running the app
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

# Описание апи:
# Модуль auth:
## POST /auth/signin

Регистрация нового пользователя:

Вход:

```json
{
  "email": "example@exe.com",
  "password": "example",
  "nickname": "nickname"
}
```

Валидация:

- email - Обязательное поле, проверка на то, что это Емайл. Проверка на уникальность в БД
- password - Обязательное поле. Минимум 8 символов, должна быть хотябы одна буква в нижнем и верхнем регистре, должна быть хотябы одна цыфра
- nickname - Обязательное поле. Проверка на то, что это строка, и не пустая.

Выход:

```json
{
  "token": "token",
  "refresh_token": "token",
  "expire": "18000000"
}
```
## POST /auth/login

Аутентификация пользователя:

Вход:

```json
{
  "email": "example@exe.com",
  "password": "Lakazjabka20"
}
```

Валидация - если входные данные не соответствуют данному формату, или таких данных нет в базе, выдается 401 ошибка.

Выход:

```json
{
  "token": "token",
  "refresh_token": "token",
  "expire": "18000000"
}
```
## GET /auth/profile

Роут для проверки токена при переходе со страницы на страницу на фронте

Вход:

HEADER: `Authorization: Bearer {token}`

Выход:

```json
{
  "userId": "uuid",
  "username": "example@exe.com"
}
```
## POST /auth/refresh-access

Выдача нового аксес токена, при предоставлении валидного рефреш-токена

Вход:

```json
{
  "refresh_token": "e320b977-c565-48ac-b8a9-e8caf11ea4d6",
  "username": "example@exe.com",
  "userId": "uuid"
}
```

Валидация:

- refresh_token - Обязательное поле, проверка на то, что это uuid(v4)
- username - Обязательное поле. Проверка на то, что это строка, и не пустая
- userId - Обязательное поле. Проверка на то, что это строка, и не пустая.

Выход:

```json
{
  "refresh_token": "uuid",
  "access_token": "token"
}
```
## GET /auth/logout

Разлогинивание пользователя.

Вход:

HEADER: `Authorization: Bearer {token}`
# Модуль user:
## GET /users/user

Получение данных юзера:

Вход:

HEADER: `Authorization: Bearer {token}`

Выход:

```json
{
  "email": "example@exe.com",
  "nickname": "nickname",
  "tags": [
    {
      "id": 9,
      "name": "WitchersaP",
      "sortOrder": 0
    },
    {
      "id": 10,
      "name": "a",
      "sortOrder": 9
    },
    {
      "id": 11,
      "name": "b",
      "sortOrder": 9
    },
    {
      "id": 12,
      "name": "c",
      "sortOrder": 9
    }
  ]
}
```
## PUT /users/put-user

Изменяет данные пользователя:

Вход:

HEADER: `Authorization: Bearer {token}`

```json
{
  "email": "chang1e@exe.com",
  "password": "Lakazjabka20",
  "nickname": "chang1e"
}
```

Валидация:

- refresh_token - Обязательное поле, проверка на то, что это uuid(v4)
- username - Обязательное поле. Проверка на то, что это строка, и не пустая
- userId - Обязательное поле. Проверка на то, что это строка, и не пустая.

Выход:

```json
{
  "email": "chang1e@exe.com",
  "nickname": "chang1e"
}
```
## DELETE /users/delete-user

Удаляет и разлогинивает пользователя:

Вход:

HEADER: `Authorization: Bearer {token}`

# Модуль tag:
## POST /tags/post-tag

Создание тега юзером.

Вход:

HEADER: `Authorization: Bearer {token}`

```json
{
  "name": "example",
  "sortOrder": "0"
}
```

Валидация:

- name - Обязательное поле, проверка на то, что это строка
- sortOrder - Опциональное поле. Проверка на то, что это строка-номер. Если не указан, подставляется 0

Выход:

```json
{
  "id": "id",
  "name": "example",
  "sortOrder": "0"
}
```
## GET /tags/get-tag/:id

Получения тега и информации о его создателе по id тега.

Вход:

HEADER: `Authorization: Bearer {token}`

Выход:

```json
{
  "creator": {
    "nickname": "example",
    "uid": "exam-pl-eUID"
  },
  "name": "example",
  "sortOrder": "0"
}
```

## GET /tags/get-tags

Вход:

HEADER: `Authorization: Bearer {token}`

Query params: ?sortByOrder&sortByName&offset=10&length=10

Валидация:

- sortByOrder - Опциональное поле, равно undefined (пустой строке)
- sortByName - Опциональное поле, равно undefined (пустой строке)
- offset - Опциональное поле. Проверка на то, что это цыфра.
- length - Опциональное поле. Проверка на то, что это цыфра.

Выход:

```json
{
  "data": [
    {
      "creator": {
        "nickname": "example",
        "uid": "exam-pl-eUID"
      },
      "name": "example",
      "sortOrder": "0"
    },
    {
      "creator": {
        "nickname": "example",
        "uid": "exam-pl-eUID"
      },
      "name": "example",
      "sortOrder": "0"
    }
  ],
  "meta": {
    "offset": 10,
    "length": 10,
    "quantity": 100
  }
}
```

## PUT /tags/put-tag/:id
Изменение тега, Тэг может менять только владелец.

Вход:
id;
HEADER: `Authorization: Bearer {token}`

```json
{
  "name": "example",
  "sortOrder": "0"
}
```
Валидация:

- name - Обязательное поле, проверка на то, что это строка
- sortOrder - Опциональное поле. Проверка на то, что это строка-номер. Если не указан, подставляется 0

Выход:

```json
{
  "creator": {
    "nickname": "example",
    "uid": "exam-pl-eUID"
  },
  "name": "example",
  "sortOrder": "0"
}
```
## DELETE /tags/delete-tag/:id
Удаление тега, тег может удалить только владелец.
Каскадом удалем все связанные записи с этим Тэгом.

Вход:
id;
HEADER: `Authorization: Bearer {token}`
## POST /tags/user/tag
Прикоепляет к юзеру указанные теги.
Проверяеются тэги на наличие в базе и добавляются к пользователю.

Пример: Если тэга с id 2 нет в базе то и тэг с id 1 не добавится пользователю

Вход:

HEADER: `Authorization: Bearer {token}`

```json
{
  "tags": [1, 2]
}
```
Валидация:

- tags - Обязательное поле, проверка на то, что это массив чисел, проверка на повторяющиеся цыфры в массиве

Выход:

```json
{
  "tags": [
    {
      "id": 1,
      "name": "example",
      "sortOrder": "0"
    },
    {
      "id": 2,
      "name": "example",
      "sortOrder": "0"
    },
    {
      "id": 3,
      "name": "example",
      "sortOrder": "0"
    }
  ]
}
```
## DELETE /tags/user/tag
Удаляет привязанный к текущему юзеру тег по айди.
Возвращает все привязанные к юзеру теги после удаления.

Вход:
id;
HEADER: `Authorization: Bearer {token}`

Выход:

```json
{
  "tags": [
    {
      "id": 1,
      "name": "example",
      "sortOrder": "0"
    },
    {
      "id": 2,
      "name": "example",
      "sortOrder": "0"
    },
    {
      "id": 3,
      "name": "example",
      "sortOrder": "0"
    }
  ]
}
```
## GET /tags/user/tag/my
Возвращает теги, у которых текущий юзер является создателем.

Вход:

HEADER: `Authorization: Bearer {token}`

Выход:

```json
{
  "tags": [
    {
      "id": 1,
      "name": "example",
      "sortOrder": "0"
    },
    {
      "id": 2,
      "name": "example",
      "sortOrder": "0"
    },
    {
      "id": 3,
      "name": "example",
      "sortOrder": "0"
    }
  ]
}
## License

Nest is [MIT licensed](LICENSE).
