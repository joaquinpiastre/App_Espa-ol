# Instalar la app HESM en Android (sin servidor de desarrollo local)

Esta guía explica cómo generar un **APK instalable** en la nube con **EAS Build** (Expo Application Services). Una vez instalada la app en el teléfono, **no necesitás tener la PC corriendo** `npm start` ni Expo Go en modo desarrollo: la app funciona sola, como cualquier aplicación descargada.

## Qué vas a obtener

| Opción | Resultado |
|--------|-----------|
| **EAS Build (recomendado)** | Un archivo **APK** (o enlace de descarga) que instalás en Android. La app incluye todo el JavaScript embebido. |
| **Expo Go + `npm start`** | No cuenta como “sin local”: el teléfono depende de tu PC en la misma red. |

El perfil **`preview`** de este proyecto (`eas.json`) está pensado para **distribución interna** (instalación directa, sin Play Store).

## Requisitos previos

1. **Cuenta gratuita en Expo**: [https://expo.dev/signup](https://expo.dev/signup)
2. **Node.js** y dependencias del proyecto ya instaladas (`npm install`).
3. **No hace falta Android Studio** en tu PC para compilar: la compilación ocurre en los servidores de Expo.

## Pasos (primera vez)

### 1. Iniciar sesión en EAS (una vez por máquina)

En la carpeta del proyecto:

```powershell
cd "ruta\a\App Movil HESM"
npx eas-cli login
```

Seguí las indicaciones (usuario/contraseña de expo.dev o token).

Comprobá que estás logueado:

```powershell
npx eas-cli whoami
```

### 2. Vincular el proyecto (si hace falta)

Este repo ya tiene `extra.eas.projectId` en `app.json`. Si en algún momento `eas` pidiera configuración:

```powershell
npx eas-cli init
```

(o dejá que el primer `build` te guíe).

### 3. Generar el APK en la nube

Perfil **`preview`** (APK para pruebas internas, según `eas.json`):

```powershell
npx eas-cli build --platform android --profile preview
```

- La primera vez puede pedirte **credenciales de firma Android**. Elegí la opción recomendada: **que EAS genere y guarde un keystore** (gestión en la nube).
- El proceso es **no interactivo en terminal** salvo esas preguntas iniciales; la compilación corre en Expo.

### 4. Descargar e instalar en el teléfono

Cuando termine el build:

1. Abrí el enlace que muestra la terminal o entrá a [https://expo.dev](https://expo.dev) → tu proyecto → **Builds**.
2. Descargá el **APK** en el Android (por enlace, QR o enviándote el archivo por WhatsApp/Drive/USB).
3. En el teléfono: **Ajustes → Seguridad** (o según tu marca) y permití **“Orígenes desconocidos” / instalar apps de fuentes desconocidas** solo para el navegador o gestor de archivos que uses.
4. Abrí el APK y tocá **Instalar**.

> **Play Store:** para publicar en Google Play hace falta un **AAB** y la cuenta de desarrollador de Google; eso es otro flujo (`production` + `eas submit`). Esta guía es solo instalación directa del APK.

## Comandos útiles

| Comando | Uso |
|---------|-----|
| `npx eas-cli build -p android --profile preview` | APK interno (pruebas). |
| `npx eas-cli build -p android --profile production` | Build de producción (suele usarse con versión/subida a tiendas). |
| `npx eas-cli build -p android --profile development` | Cliente de desarrollo (requiere dev server en algunos flujos); **no** es lo típico para “solo instalar y usar”. |

## Actualizar la app después de cambios en el código

Cada vez que cambies el proyecto y quieras **otra versión instalable**:

1. Volvé a ejecutar el mismo comando de build (`preview` o el perfil que uses).
2. Descargá el nuevo APK e instalalo (Android suele actualizar por encima de la versión anterior si el `versionCode` sube; el perfil `production` en este proyecto tiene `autoIncrement` para eso).

Para **actualizaciones sin reinstalar el APK** existe **EAS Update** (OTA); implica configuración extra y un canal asociado al build. Si lo necesitás, conviene revisar la documentación oficial de Expo sobre Updates.

## Solución de problemas breve

- **“Not logged in”**: ejecutá `npx eas-cli login`.
- **Build fallido por proyecto**: revisá el log en la página del build en expo.dev.
- **No puedo instalar el APK**: revisá permisos de “instalar apps desconocidas” y que el APK no esté corrupto (vuelve a descargar).

## Referencias

- [EAS Build – Introducción](https://docs.expo.dev/build/introduction/)
- [Perfiles en `eas.json`](https://docs.expo.dev/build/eas-json/)
- [Cuenta Expo](https://expo.dev)
