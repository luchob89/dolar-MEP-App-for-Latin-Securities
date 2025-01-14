# Aplicación de compra/venta DE Dólar MEP para Latin Securities

## Descripción General

Esta aplicación de compra/venta de Dólar MEP es una simulación de una herramienta financiera diseñada para facilitar la compra y venta de USD utilizando ARS a través del bono AL30. La aplicación permite a los usuarios calcular los costos de transacción, ejecutar operaciones de compra/venta, gestionar sus saldos y ver su historial de transacciones.
Es una aplicación realizada con el framework Next.js de React que incluye Redux como librería de manejo de estados. Siempre que puedo elijo Next.js por varias razones. Ya tengo experiencia previa con este framework y me gustan algunos features como la estructura de archivos, las optimizaciones para imágenes y fuentes y las mejoras de performance que aplican para renderización en cliente/servidor y data fetching. Creo que es un framework que tiene muy en cuenta la perspectiva de los desarrolladores y su documentación siempre me pareció muy amigable.
Utilicé Redux, por un lado, para gestionar los estados de orden superior de la aplicación (saldos, qué componente mostrar) y, por otro lado, como una especie de base de datos en el lado del cliente para guardar el registro de transacciones y generar así el Historial de Transacciones. La implementación de una base de datos (relacional o no) me pareció que demoraría bastante más el tiempo de desarrollo sin mejorar necesariamente la funcionalidad del producto. Considerando que el objetivo de la aplicación es presentarla como una prueba técnica, resolví de esta manera la poca información persistente que la misma necesita. No sería este el caso si se considerara que la aplicación funcione en un contexto de saldos reales no emulados.

## Link para visita directa (deploy productivo en servidor de Vercel)

https://dolar-mep-app-for-latin-securities.vercel.app/

## Funcionalidades

- **Comprar USD**: Calcular y ejecutar la compra de USD utilizando ARS.
- **Vender USD**: Calcular y ejecutar la venta de USD para obtener ARS.
- **Historial de Transacciones**: Ver un historial de todas las transacciones de compra y venta.
- **Gestión de Saldos**: Rastrear y actualizar los saldos en ARS y USD.

## Componentes

### `App`

El punto de entrada principal de la aplicación. Configura el proveedor de Redux y renderiza los componentes `ChooseAmounts`, `MainCard`, `BuyCard` y `Sellcard`.

### `ChooseAmounts`

Permite a los usuarios ingresar montos de saldos iniciales en ARS y USD, para realizar una simulación precisa de valores cercanos a la realidad del cliente, o continuar utilizando los saldos predeterminados de la aplicación, si es que el cliente decide probar la funcionalidad de la misma sin detenerse a llenar los campos iniciales. Estos últimos incluyen validación de entrada y manejo de errores para saldos menores o iguales a 0. Además, si se han realizado una o más transacciones, esta pantalla incluye un botón de borrado del Historial de Transacciones.

### `MainCard`

El componente principal que proporciona la interfaz para comprar y vender USD. Muestra saldos iniciales en ARS y en USD y los botones para elegir la acción acompañados de la cotización de compra/venta actual. Cuando se han realizado una o más transacciones, este componente incluye la tabla del Historial de Transacciones debajo del componente principal.

### `BuyCard`

Proporciona la interfaz para ingresar el monto de ARS a utilizar para comprar USD. Incluye validación de entrada con manejo de errores para saldos menores o iguales a 0 y botón de "Comprar todo mi disponible" para hacer el cálculo automático de cuántos títulos se alcanzan a comprar con el saldo actual en ARS.

### `SellCard`

Proporciona la interfaz para ingresar el monto de USD a vender para obtener ARS. Incluye validación de entrada con manejo de errores para saldos menores o iguales a 0 y botón de "Vender todo mi disponible" para hacer el cálculo automático de cuántos títulos se alcanzan a vender con el saldo actual en USD.

### `BuyCalculationResult`

Maneja el cálculo y la visualización de los resultados para las transacciones de compra. Muestra el monto a comprar, la cotización actual de compra, el nombre del bono, la cant. de títulos a comprar, el monto a acreditar en ARS y el monto de la compra final en USD. También gestiona los modales de confirmación y éxito para las operaciones de compra.

### `SellCalculationResult`

Maneja el cálculo y la visualización de los resultados para las transacciones de venta. Muestra el monto a vender, la cotización actual de venta, el nombre del bono, la cant. de títulos a vender, el monto a debitar en USD y el monto de la compra final en ARS. También gestiona los modales de confirmación y éxito para las operaciones de venta.

### `TxsHistoryTable`

Muestra una tabla con todas las transacciones pasadas, incluyendo detalles diferentes para dispositivos desktop y mobile. Para el primer caso se muestran la fecha, el tipo de transacción, el saldo previo (en ARS para compras, en USD para ventas), el monto comprado/vendido, el saldo posterior (en ARS para compras, en USD para ventas) y la cotización utilizada para la transacción. Para dispositivos móviles se acotaron los datos a la fecha, el monto comprado/vendido y la cotización utilizada. Esta tabla puede borrarse en la pantalla previa de `ChooseAmounts` por si quieren "resetearse" los registros anteriores a una nueva selección de montos.

## Gestión de Estado

La aplicación utiliza Redux para la gestión del estado. El slice principal del estado es `userDataSlice`, que incluye acciones para cambiar saldos, cambiar modos (que a su vez cambia la pantalla que se renderiza al cliente) y agregar registros de transacciones.

## Pruebas

La aplicación incluye pruebas unitarias para todos los componentes principales utilizando Jest y React Testing Library. Las pruebas cubren la renderización, cambios en las entradas, manejo de errores y despacho de acciones.

## Instalación

Para instalar y ejecutar la aplicación localmente, sigue estos pasos:

1. Clona el repositorio:
    
	```
	git clone https://github.com/luchob89/dolar-MEP-App-for-Latin-Securities
	```
	
2. Navega al directorio del proyecto:

    ```
	cd dolar-MEP-App-for-Latin-Securities
	```
	
3. Instala las dependencias:
    
	```
	npm install
	```
	
4. Inicia el servidor de desarrollo:
    
	```
	npm run dev
	```
	
5. O construye e inicia una versión productiva:
    
	```
	npm start
	```
	
## Uso

1. Abre la aplicación en tu navegador.
2. Ingresa el monto de ARS que deseas usar para comprar USD o el monto de USD que deseas vender para obtener ARS.
3. Haz clic en el botón "Comprar" para comprar USD o en el botón "Vender" para vender USD.
4. Confirma la transacción en el modal que aparece.
5. Visualiza los saldos actualizados y el historial de transacciones.

