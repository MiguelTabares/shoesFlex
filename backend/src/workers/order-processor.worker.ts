import { parentPort, workerData } from 'worker_threads';

/**
 * Simulación de un nodo distribuido.
 * Este código se ejecuta en un hilo de CPU separado.
 */
async function processOrderBackground() {
    const { orderId, customerEmail, total } = workerData;

    console.log(`[Worker] Iniciando procesamiento distribuido para Orden: ${orderId}`);

    // Simulación de tarea pesada (Generación de factura y envío de email)
    // En un sistema real, aquí llamarías a un servicio externo de correos (como SendGrid)
    await new Promise(resolve => setTimeout(resolve, 5000)); 

    console.log(`[Worker] Factura de $${total} enviada con éxito a ${customerEmail}`);

    // Notificar al hilo principal que el nodo terminó su tarea
    parentPort?.postMessage({
        success: true,
        orderId,
        timestamp: new Date().toISOString()
    });
}

processOrderBackground();
