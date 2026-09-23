# Aplicación de compra/venta de Dólar MEP para Latin Securities

[![en](https://img.shields.io/badge/lang-en-blue.svg)](https://github.com/luchob89/dolar-MEP-App-for-Latin-Securities/blob/main/README.md)

## Descripción General

Esta aplicación de compra/venta de Dólar MEP es una simulación de una herramienta financiera diseñada para facilitar la compra y venta de USD utilizando ARS a través del bono AL30. La aplicación permite a los usuarios calcular los costos de transacción, ejecutar operaciones de compra/venta, gestionar sus saldos y ver su historial de transacciones. \
\
Es una aplicación realizada con el framework Next.js de React que incluye Redux como librería de manejo de estados. Siempre que puedo elijo Next.js por varias razones. Ya tengo experiencia previa con este framework y me gustan algunos features como la estructura de archivos, las optimizaciones para imágenes y fuentes y las mejoras de performance que aplican para renderización en cliente/servidor y data fetching. Creo que es un framework que tiene muy en cuenta la perspectiva de los desarrolladores y su documentación siempre me pareció muy amigable. \
\
Utilicé Redux, por un lado, para gestionar los estados de orden superior de la aplicación (ej. saldos del usuario en ARS y USD) y, por otro lado, como una especie de base de datos en el lado del cliente para guardar el registro de transacciones y generar así el Historial de Transacciones. La implementación de una base de datos (relacional o no) me pareció que demoraría bastante más el tiempo de desarrollo sin mejorar necesariamente la funcionalidad del producto. Considerando que el objetivo de la aplicación es presentarla como una prueba técnica, resolví de esta manera la poca información persistente que la misma necesita. No sería este el caso si se considerara que la aplicación funcione en un contexto de saldos reales no emulados.

## Link para visita directa (deploy productivo en servidor de Vercel)

https://dolar-mep-app-for-latin-securities.vercel.app/

## Funcionalidades

- **Comprar USD**: Calcular y ejecutar la compra de USD utilizando ARS.
- **Vender USD**: Calcular y ejecutar la venta de USD para obtener ARS.
- **Historial de Transacciones**: Ver un historial de todas las transacciones de compra y venta.
- **Gestión de Saldos**: Rastrear y actualizar los saldos en ARS y USD.
- **Cotización en vivo del bono AL30**: Las cotizaciones de compra/venta se calculan a partir de una cotización en vivo del bono AL30 obtenida en cada visita.
- **Selector de idioma EN/ES**: Cambia toda la interfaz entre inglés y español.

## Rutas y Componentes

La aplicación está construida sobre el App Router de Next.js, por lo que cada pantalla es una ruta real en vez de un cambio de estado del lado del cliente dentro de una sola página.

### `/` — `app/page.tsx`

Ruta de entrada. Renderiza `ChooseAmounts` (`app/chooseAmounts.tsx`), que permite a los usuarios ingresar montos de saldos iniciales en ARS y USD para una simulación más cercana a su propia realidad, o continuar con los saldos predeterminados de la aplicación. Los campos incluyen validación (deben ser mayores a 0 y menores o iguales a 100.000.000). Si ya se realizaron una o más transacciones, esta pantalla también muestra un botón para borrar el Historial de Transacciones.

### `/mainCard` — `app/mainCard/page.tsx`

Pantalla principal. Muestra los saldos actuales en ARS/USD y los botones para ir al flujo de compra o venta, cada uno acompañado de la cotización de compra/venta en vivo. Una vez que existe una o más transacciones, renderiza `TxsHistoryTable` (`app/mainCard/TxsHistoryTable.tsx`) debajo, mostrando más columnas en desktop que en mobile.

### `/mainCard/buy` — `app/mainCard/buy/page.tsx`

Permite ingresar el monto en ARS a utilizar para comprar USD (o usar "Comprar todo mi disponible" para calcular el máximo automáticamente), con validación y manejo de errores. Al calcular, renderiza `BuyCalculationResult` (`app/mainCard/buy/BuyCalculationResult.tsx`), que muestra la cotización de compra, el ticker del bono, la cantidad de títulos, el monto a debitar en ARS y el USD final acreditado, y gestiona los modales de confirmación y éxito de la operación.

### `/mainCard/sell` — `app/mainCard/sell/page.tsx`

El equivalente del lado de venta: ingresar (o autocompletar) el monto en USD a vender, y luego `SellCalculationResult` (`app/mainCard/sell/SellCalculationResult.tsx`) muestra la cotización de venta y gestiona los modales de confirmación y éxito.

## Gestión de Estado

Redux (mediante Redux Toolkit) gestiona los saldos, el historial de transacciones y el idioma seleccionado. El store (`lib/store.ts`) y su único slice, `userDataSlice` (`lib/userDataSlice.ts`), se proveen una única vez en el layout raíz (`app/layout.tsx`) a través de `lib/CustomReduxProvider.tsx`, de modo que todas las rutas comparten el mismo estado. La cotización del bono AL30 se obtiene por separado con un pequeño hook basado en SWR (`features/getAL30Data.ts`), en lugar de mediante Redux, ya que se trata de datos remotos y cacheables en vez de estado propio del usuario.

## Pruebas

La aplicación cuenta con tests unitarios/de integración para cada pantalla y componente de cálculo utilizando Jest y React Testing Library (`npm test`, 46 tests en 7 suites). Cubren renderizado, validación de inputs, navegación, estados de error y el flujo de confirmación de compra/venta, con un store de Redux nuevo y precargado en cada test.

## Scripts

| Script | Qué hace |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo local (Turbopack) |
| `npm run build` | Build de producción |
| `npm start` | Compila e inicia el servidor de producción |
| `npm run lint` | ESLint mediante `next lint` |
| `npm run typecheck` | Chequeo de TypeScript sin emitir archivos |
| `npm test` | Ejecuta la suite de tests de Jest |
| `npm run verify` | Ejecuta lint, typecheck y tests juntos |

## Instalación

Para instalar y ejecutar la aplicación localmente, siga estos pasos:

1. Clone el repositorio:

    ```
    git clone https://github.com/luchob89/dolar-MEP-App-for-Latin-Securities
    ```

2. Navegue al directorio del proyecto:

    ```
    cd dolar-MEP-App-for-Latin-Securities
    ```

3. Instale las dependencias:

    ```
    npm install
    ```

4. Ejecútela localmente en modo desarrollo:

    ```
    npm run dev
    ```

   O bien, construya e inicie una versión productiva:

    ```
    npm start
    ```

### Ejecutar con Docker

Se incluye un `Dockerfile` (build multi-stage, con el output standalone de Next.js):

```
docker build -t dolar-mep-app .
docker run -p 3000:3000 dolar-mep-app
```

## Uso

1. Abra la aplicación en su navegador.
2. Ingrese un saldo en ARS, que usará para comprar USD, y un saldo en USD, que usará para obtener ARS. También puede continuar con los saldos predeterminados por la aplicación.
3. Haga clic en el botón "Comprar USD" para comprar USD o en el botón "Vender USD" para vender USD.
4. Confirme la transacción en el modal que aparece.
5. Visualice los saldos actualizados y el historial de transacciones.
