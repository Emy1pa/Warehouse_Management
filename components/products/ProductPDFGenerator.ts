import { DProduct } from "@/app/utils/interface";
import { format } from "date-fns";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

export class ProductPDFGenerator {
  private generateHTML(product: DProduct): string {
    const stocksHtml = product.stocks
      .map(
        (stock) => `
      <div style="margin-bottom: 15px; padding: 10px; background-color: #f3f4f6; border-radius: 8px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <strong>${stock.name}</strong>
          <span style="color: ${
            stock.quantity === 0
              ? "#ef4444"
              : stock.quantity < 10
              ? "#f59e0b"
              : "#10b981"
          }">
            ${stock.quantity} unités
          </span>
        </div>
        <div>
          <span style="color: #4b5563;">📍 ${stock.localisation.city}</span>
        </div>
      </div>
    `
      )
      .join("");

    const editHistoryHtml = product.editedBy
      .map(
        (edit) => `
      <div style="display: flex; justify-content: space-between; padding: 8px 0;">
        <span style="color: #4b5563;">Agent #${edit.warehousemanId}</span>
        <span style="color: #4b5563;">${format(
          new Date(edit.at),
          "dd/MM/yyyy"
        )}</span>
      </div>
    `
      )
      .join("");

    return `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
            body { font-family: 'Helvetica'; padding: 20px; }
            .header { margin-bottom: 30px; }
            .section { margin-bottom: 25px; }
            .title { font-size: 24px; font-weight: bold; color: #1f2937; margin-bottom: 20px; }
            .info-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
            .label { color: #4b5563; }
            .value { font-weight: 500; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="title">Rapport de Produit</h1>
            <p style="color: #4b5563;">Généré le ${format(
              new Date(),
              "dd/MM/yyyy à HH:mm"
            )}</p>
          </div>

          <div class="section">
            <h2>Informations Produit</h2>
            <div class="info-row">
              <span class="label">Nom:</span>
              <span class="value">${product.name}</span>
            </div>
            <div class="info-row">
              <span class="label">Type:</span>
              <span class="value">${product.type}</span>
            </div>
            <div class="info-row">
              <span class="label">Code-barres:</span>
              <span class="value">${product.barcode}</span>
            </div>
            <div class="info-row">
              <span class="label">Prix:</span>
              <span class="value">${product.price} DH</span>
            </div>
            ${
              product.solde
                ? `
              <div class="info-row">
                <span class="label">Prix Soldé:</span>
                <span class="value" style="color: #10b981">${product.solde} DH</span>
              </div>
            `
                : ""
            }
            <div class="info-row">
              <span class="label">Fournisseur:</span>
              <span class="value">${product.supplier}</span>
            </div>
          </div>

          <div class="section">
            <h2>Stock par Emplacement</h2>
            ${stocksHtml}
          </div>

          <div class="section">
            <h2>Historique des Modifications</h2>
            ${editHistoryHtml}
          </div>
        </body>
      </html>
    `;
  }

  public async generateAndSharePDF(product: DProduct): Promise<void> {
    try {
      const html = this.generateHTML(product);
      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
      });

      await Sharing.shareAsync(uri, {
        UTI: ".pdf",
        mimeType: "application/pdf",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw new Error("Failed to generate PDF");
    }
  }
}
