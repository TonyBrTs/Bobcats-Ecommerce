/**
 * Page for shipping policy.
 */
export default function PoliticasEnvioPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-text-primary">Políticas de Envío</h1>
      <p className="text-lg mb-4 text-text-secondary">
        En Bobcats, trabajamos para ofrecer un servicio de envío rápido y confiable. A continuación,
        detallamos nuestras políticas de envío y los términos que aplican a todos los pedidos
        realizados en nuestro sitio.
      </p>
      <h2 className="text-2xl font-semibold mb-2 text-text-primary">Plazos de Entrega</h2>
      <p className="text-lg mb-4 text-text-secondary">
        Los plazos de entrega varían según la ubicación y el tipo de envío seleccionado.
        Generalmente, los pedidos nacionales se entregan entre 3 y 5 días hábiles, mientras que los
        internacionales pueden tardar entre 7 y 15 días hábiles. Recibirá una notificación con los
        detalles de seguimiento una vez que su pedido haya sido enviado.
      </p>
      <h2 className="text-2xl font-semibold mb-2 text-text-primary">Costos de Envío</h2>
      <p className="text-lg mb-4 text-text-secondary">
        El costo de envío se calcula en función del peso total del pedido y la ubicación de entrega.
        Los costos exactos se mostrarán en el proceso de compra antes de que finalice la compra.
      </p>
      <h2 className="text-2xl font-semibold mb-2 text-text-primary">Envíos Internacionales</h2>
      <p className="text-lg mb-4 text-text-secondary">
        Ofrecemos envíos internacionales a varios países. Por favor, tenga en cuenta que los plazos
        de entrega y los costos adicionales, como los aranceles aduaneros, son responsabilidad del
        cliente.
      </p>
      <h2 className="text-2xl font-semibold mb-2 text-text-primary">Devoluciones y Reembolsos</h2>
      <p className="text-lg mb-4 text-text-secondary">
        Si no está satisfecho con su pedido, puede devolverlo dentro de los 30 días posteriores a la
        recepción del producto. Las devoluciones están sujetas a las condiciones de nuestra política
        de devoluciones, disponible en el sitio web.
      </p>
    </div>
  );
}
