# Guía para publicar la app en Play Store y App Store

## Estado actual de la app

| Ítem | Estado |
|------|--------|
| Configuración Android (`com.hesm.app`) | ✅ Listo |
| Configuración iOS (`com.hesm.app`) | ✅ Listo |
| Ícono de la app | ✅ `assets/icon.png` |
| Pantalla de carga (splash) | ✅ `assets/splash.png` |
| Política de privacidad (página web) | ✅ `legal/privacidad.html` |
| Términos y condiciones (página web) | ✅ `legal/terminos.html` |
| Links legales en la app (pantalla Perfil) | ✅ Listo |
| Padrón de socios en Supabase | ✅ Listo |
| Panel admin para actualizar socios | ✅ `https://hesm-admin.vercel.app` |
| EAS configurado | ✅ `eas.json` |

---

## PASO 0 — Publicar las páginas legales (hacer PRIMERO)

Las tiendas exigen una URL pública de Política de Privacidad. Hay que desplegar la carpeta `legal/`.

```bash
cd legal
npx vercel
```

Responder:
- **Project name**: `hesm-legal`
- **Customize settings?**: No

Al terminar vas a tener una URL como `https://hesm-legal.vercel.app`.

> Después de desplegar, verificá que funcionen:
> - `https://hesm-legal.vercel.app/privacidad.html`
> - `https://hesm-legal.vercel.app/terminos.html`

---

## PASO 1 — Crear las cuentas de desarrollador

### Google Play (Android) — U$D 25 pago único
1. Ir a https://play.google.com/console
2. Iniciar sesión con cuenta Google
3. Hacer clic en **Empezar** y pagar U$D 25 con tarjeta
4. Completar datos del desarrollador (nombre del hospital, dirección, teléfono, email)
5. **Esperar aprobación: puede tardar hasta 48 horas**

### Apple Developer (iOS) — U$D 99 por año
1. Ir a https://developer.apple.com/programs/enroll/
2. Iniciar sesión con Apple ID
3. Elegir **Organización** si es a nombre del hospital, o **Individual**
4. Pagar U$D 99 con tarjeta
5. Aprobación casi inmediata (puede tardar 1-2 días si es organización)

---

## PASO 2 — Compilar la app para producción

> Hacer esto una vez que tengas al menos la cuenta de Google o Apple aprobada.

### Android
```bash
cd "App Movil HESM"
eas build --platform android --profile production
```

- Tarda entre 10 y 20 minutos
- Al terminar te da un link para descargar el archivo `.aab`
- **Guardá ese archivo** — lo necesitás para subir a Play Store

### iOS
```bash
eas build --platform ios --profile production
```

- Tarda entre 15 y 25 minutos
- EAS maneja automáticamente los certificados de Apple (no necesitás hacer nada extra)
- Al terminar genera un archivo `.ipa`

---

## PASO 3 — Subir a Google Play Store

### 3.1 Crear la app en Play Console
1. Ir a https://play.google.com/console
2. Clic en **Crear aplicación**
3. Completar:
   - **Nombre**: `Hospital Español del Sur Mendocino`
   - **Idioma predeterminado**: Español (España) o Español (Latinoamérica)
   - **Tipo**: Aplicación
   - **¿Es gratis o de pago?**: Gratuita
4. Aceptar las políticas y hacer clic en **Crear app**

### 3.2 Completar el formulario de la tienda

Ir a **Presencia en Play Store → Ficha de Play Store principal**:

**Descripción corta** (máx. 80 caracteres):
```
App oficial para socios del Hospital Español del Sur Mendocino.
```

**Descripción completa** (máx. 4000 caracteres):
```
La app oficial del Hospital Español del Sur Mendocino (HESM) para socios
y público general de San Rafael, Mendoza.

PARA SOCIOS:
• Accedé a tu información de socio con DNI y número de socio
• Consultá tu plan, domicilio y estado de cuotas
• Pagá tus cuotas fácilmente con Mercado Pago
• Accedé a tu credencial digital

PARA TODOS:
• Cartilla médica completa con especialidades y profesionales
• Contacto directo con el hospital por teléfono y WhatsApp
• Farmacias en convenio
• Información de emergencias y guardia 24 horas
• Dirección y ubicación del hospital

El Hospital Español del Sur Mendocino está ubicado en Av. El Libertador 950,
San Rafael, Mendoza. Comprometidos con la salud y el cuidado de la comunidad.
```

**Categoría**: Medicina  
**Email de contacto**: info@hesm.org  
**Política de privacidad**: `https://hesm-legal.vercel.app/privacidad.html`

### 3.3 Capturas de pantalla requeridas

Necesitás **mínimo 2 capturas de pantalla** de teléfono.

**Cómo sacarlas:**
1. Abrí la app en tu celular (o emulador)
2. Navegá por las pantallas principales (inicio, perfil, cartilla)
3. Sacá capturas con el celular (botón Power + Volumen Abajo en Android)
4. Subí las imágenes en Play Console → Ficha de Play Store → Capturas de pantalla

Pantallas recomendadas para capturar:
- Pantalla de inicio/login
- Pantalla principal (inicio)
- Cartilla médica
- Perfil del socio

### 3.4 Gráfico de función (Feature Graphic)

Play Store requiere una imagen de **1024 x 500 px**.

Podés crear una simple con Canva (gratis):
1. Ir a https://www.canva.com
2. Crear diseño personalizado → 1024 x 500 px
3. Fondo color `#00666e` (verde del hospital)
4. Logo del hospital + nombre "Hospital Español del Sur Mendocino"
5. Descargar como PNG y subir en Play Console

### 3.5 Subir el AAB (el archivo de la app)

1. En Play Console ir a **Pruebas → Pruebas internas**
2. Clic en **Crear nueva versión**
3. Subir el archivo `.aab` descargado en el Paso 2
4. En "Novedades de esta versión" escribir: `Versión inicial de la app`
5. Guardar y revisar → **Publicar en pruebas internas**

### 3.6 Promover a producción

Después de que la versión pase la revisión de pruebas internas (suele ser rápido):
1. Ir a **Producción → Crear nueva versión**
2. Clic en **Promover versión** desde pruebas internas
3. Configurar el porcentaje de lanzamiento (empezar con 20% o directo al 100%)
4. **Enviar para revisión**

> La revisión de Google tarda entre 1 y 7 días hábiles para apps nuevas.

---

## PASO 4 — Subir a App Store (iOS)

### 4.1 Crear la app en App Store Connect

1. Ir a https://appstoreconnect.apple.com
2. Iniciar sesión con tu Apple ID de desarrollador
3. Ir a **Mis Apps → + → Nueva App**
4. Completar:
   - **Plataformas**: iOS
   - **Nombre**: `Hospital Español del Sur Mendocino`
   - **Idioma principal**: Español (México) o Español
   - **Bundle ID**: `com.hesm.app` (seleccionarlo de la lista)
   - **SKU**: `hesm-app-001`
   - **Acceso de usuario**: Acceso completo
5. Clic en **Crear**

### 4.2 Completar la información de la app

En la pantalla de tu app en App Store Connect:

**Descripción** (igual a Play Store, máx. 4000 caracteres):
```
La app oficial del Hospital Español del Sur Mendocino (HESM) para socios
y público general de San Rafael, Mendoza.

PARA SOCIOS:
• Accedé a tu información de socio con DNI y número de socio
• Consultá tu plan, domicilio y estado de cuotas
• Pagá tus cuotas fácilmente con Mercado Pago
• Accedé a tu credencial digital

PARA TODOS:
• Cartilla médica completa con especialidades y profesionales
• Contacto directo con el hospital por teléfono y WhatsApp
• Farmacias en convenio
• Información de emergencias y guardia 24 horas
• Dirección y ubicación del hospital

Ubicados en Av. El Libertador 950, San Rafael, Mendoza.
Comprometidos con la salud y el cuidado de la comunidad.
```

**Palabras clave** (máx. 100 caracteres):
```
hospital,socios,salud,mendoza,san rafael,médico,cartilla,guardia,turnos,hesm
```

**URL de soporte**: `https://hesm-legal.vercel.app`  
**URL de política de privacidad**: `https://hesm-legal.vercel.app/privacidad.html`  
**Categoría principal**: Medicina  
**Clasificación de edad**: 4+ (sin contenido adulto)

### 4.3 Capturas de pantalla para iOS

Apple requiere capturas para distintos tamaños de pantalla.  
El mínimo requerido es para **iPhone 6.9"** (iPhone 16 Pro Max).

**Cómo obtenerlas:**
- Usá un iPhone real y sacá capturas
- O usá el simulador de iOS en Xcode (Mac) → Device → iPhone 16 Pro Max

### 4.4 Subir la app a App Store Connect

```bash
eas submit --platform ios
```

EAS sube automáticamente el build más reciente a App Store Connect.  
Después de unos minutos aparece en **TestFlight** dentro de App Store Connect.

### 4.5 Enviar para revisión

1. En App Store Connect, ir a tu app → **Enviar para revisión**
2. Completar el cuestionario de contenido (responder NO a todo si no aplica)
3. Elegir publicación manual o automática tras aprobación
4. **Enviar**

> Apple tarda entre 1 y 3 días hábiles en revisar. Si rechazan por algo, te dicen exactamente qué corregir.

---

## PASO 5 — Actualización futura de la app

Cuando hagas cambios en el código y quieras publicar una nueva versión:

```bash
# Android
eas build --platform android --profile production
# Luego subir el nuevo AAB en Play Console → Producción → Nueva versión

# iOS
eas build --platform ios --profile production
eas submit --platform ios
# Luego en App Store Connect → Enviar para revisión
```

> El número de versión se incrementa automáticamente porque `appVersionSource: "remote"` está configurado en `eas.json`.

---

## PASO 6 — Actualizar el padrón de socios (flujo diario)

El empleado del hospital usa el panel admin para actualizar los socios sin necesidad de recompilar la app:

1. Ir a `https://hesm-admin.vercel.app`
2. Ingresar con contraseña: `hesm2025admin`
3. Seleccionar el archivo Excel exportado del sistema del hospital
4. Hacer clic en **"Actualizar socios en la app"**
5. Esperar confirmación: `✓ X socios actualizados correctamente`

La app refleja los cambios de forma inmediata. Los socios que ya iniciaron sesión tienen sus datos en caché y pueden usar la app sin internet.

---

## Resumen de URLs importantes

| Recurso | URL |
|---------|-----|
| Panel admin socios | https://hesm-admin.vercel.app |
| Política de privacidad | https://hesm-legal.vercel.app/privacidad.html |
| Términos y condiciones | https://hesm-legal.vercel.app/terminos.html |
| Supabase (base de datos) | https://supabase.com/dashboard/project/vdtfxarnrdmvacatyujy |
| Play Console | https://play.google.com/console |
| App Store Connect | https://appstoreconnect.apple.com |

---

## Checklist final antes de enviar a las tiendas

- [ ] Páginas legales publicadas en `https://hesm-legal.vercel.app`
- [ ] Cuenta Google Play aprobada (U$D 25)
- [ ] Cuenta Apple Developer aprobada (U$D 99/año) — solo para iOS
- [ ] Build de producción generado con `eas build`
- [ ] Capturas de pantalla de la app listas (mínimo 2)
- [ ] Feature graphic de 1024x500 lista (Play Store)
- [ ] App subida a Play Console / App Store Connect
- [ ] Formularios de ficha de tienda completados
- [ ] Política de privacidad URL ingresada en las tiendas
- [ ] Enviado para revisión
