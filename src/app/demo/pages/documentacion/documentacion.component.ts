import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DocumentacionService } from './service/documentacion.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

/**
 * Componente para mostrar la documentación completa del sistema.
 * 
 * @remarks
 * Este componente muestra información detallada sobre:
 * - Arquitectura del sistema
 * - Diagramas UML (clases, despliegue, arquitectura)
 * - Endpoints disponibles
 * - Análisis técnico
 * - Documentación de código
 * 
 * @example
 * ```html
 * <app-documentacion></app-documentacion>
 * ```
 */
@Component({
  selector: 'app-documentacion',
  standalone: true,
  imports: [CommonModule, NgxSpinnerModule],
  templateUrl: './documentacion.component.html',
  styleUrl: './documentacion.component.scss'
})
export class DocumentacionComponent implements OnInit {
  documentacion: any = null;
  loading = false;
  activeTab: string = 'info';

  constructor(
    private documentacionService: DocumentacionService,
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.cargarDocumentacion();
  }

  /**
   * Carga la documentación del sistema desde el backend.
   */
  cargarDocumentacion(): void {
    this.loading = true;
    this.spinner.show();

    this.documentacionService.obtenerDocumentacion().subscribe({
      next: (response) => {
        this.loading = false;
        this.spinner.hide();
        
        if (response && response.data) {
          this.documentacion = response.data;
        } else {
          Swal.fire('Error', 'No se pudo cargar la documentación', 'error');
        }
      },
      error: (error) => {
        this.loading = false;
        this.spinner.hide();
        console.error('Error al cargar documentación:', error);
        Swal.fire('Error', 'Error al cargar la documentación del sistema', 'error');
      }
    });
  }

  /**
   * Cambia la pestaña activa.
   * 
   * @param tab Nombre de la pestaña a activar
   */
  cambiarTab(tab: string): void {
    this.activeTab = tab;
  }

  /**
   * Abre la documentación de Swagger en una nueva ventana.
   */
  abrirSwagger(): void {
    window.open('http://localhost:8000/clinica/v1/swagger-ui.html', '_blank');
  }

  /**
   * Obtiene las claves de los endpoints para iterar sobre ellos.
   * 
   * @returns Array con las claves de los endpoints
   */
  getEndpointsKeys(): string[] {
    if (!this.documentacion || !this.documentacion.endpoints) {
      return [];
    }
    return Object.keys(this.documentacion.endpoints);
  }

  /**
   * Obtiene la descripción de un endpoint basado en su nombre.
   * 
   * @param endpoint Nombre del endpoint
   * @returns Descripción del endpoint
   */
  getEndpointDescription(endpoint: string): string {
    const descriptions: { [key: string]: string } = {
      'GET': 'Obtener información',
      'POST': 'Crear o procesar información',
      'PUT': 'Actualizar información',
      'DELETE': 'Eliminar información'
    };

    for (const [method, desc] of Object.entries(descriptions)) {
      if (endpoint.includes(method)) {
        return desc;
      }
    }
    return 'Operación del sistema';
  }

  /**
   * Maneja errores al cargar imágenes de diagramas.
   * 
   * @param event Evento de error de la imagen
   * @param tipo Tipo de diagrama que falló
   */
  onImageError(event: any, tipo: string): void {
    console.error(`Error al cargar imagen del diagrama: ${tipo}`, event);
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    
    // Mostrar mensaje de error
    const parent = img.parentElement;
    if (parent) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'alert alert-warning';
      errorDiv.innerHTML = `
        <i class="feather icon-alert-triangle"></i>
        <strong>Error:</strong> No se pudo cargar la imagen del ${tipo}. 
        Verifica que el archivo exista en el servidor.
      `;
      parent.appendChild(errorDiv);
    }
  }

  /**
   * Convierte texto con formato markdown básico a HTML.
   * 
   * @param text Texto con formato markdown
   * @returns HTML sanitizado
   */
  markdownToHtml(text: string): SafeHtml {
    if (!text) {
      return this.sanitizer.sanitize(1, '') || '';
    }

    let html = text;

    // Primero, procesar listas numeradas antes de convertir saltos de línea
    // Convertir listas numeradas (1. texto, 2. texto, etc.)
    const lines = html.split('\n');
    const processedLines: string[] = [];
    let inNumberedList = false;
    let listItems: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const numberedMatch = line.match(/^(\s*)(\d+)\.\s+(.+)$/);
      
      if (numberedMatch) {
        if (!inNumberedList) {
          inNumberedList = true;
          listItems = [];
        }
        // Convertir negritas en el contenido de la lista
        let content = numberedMatch[3].replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        listItems.push(`<li>${content}</li>`);
      } else {
        if (inNumberedList) {
          processedLines.push('<ol>' + listItems.join('') + '</ol>');
          inNumberedList = false;
          listItems = [];
        }
        processedLines.push(line);
      }
    }
    
    // Si terminamos en una lista, cerrarla
    if (inNumberedList) {
      processedLines.push('<ol>' + listItems.join('') + '</ol>');
    }

    html = processedLines.join('\n');

    // Convertir negritas **texto** a <strong>texto</strong> (para texto fuera de listas)
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Convertir listas con guiones a <ul><li>
    html = html.replace(/^(\s*)-\s+(.+)$/gm, '<li>$2</li>');
    
    // Envolver elementos <li> consecutivos en <ul> (solo si no están ya en <ol>)
    html = html.replace(/(<li>.*?<\/li>(?:\s*\n?)+)+/g, (match) => {
      // Verificar que no esté dentro de una lista ordenada
      if (!match.includes('</ol>') && !match.includes('<ol>')) {
        return '<ul>' + match.replace(/\n/g, '') + '</ul>';
      }
      return match;
    });

    // Convertir saltos de línea restantes a <br>, pero no dentro de listas
    html = html.split('\n').map(line => {
      if (line.trim() === '' || line.match(/^<(ul|ol|li)/) || line.match(/<\/(ul|ol|li)>/)) {
        return line;
      }
      return line + '<br>';
    }).join('');

    // Limpiar <br> duplicados y <br> antes/después de listas
    html = html.replace(/(<br>\s*){2,}/g, '<br>');
    html = html.replace(/<br>\s*<(ul|ol)/g, '<$1');
    html = html.replace(/(<\/(ul|ol)>)\s*<br>/g, '$1');

    return this.sanitizer.sanitize(1, html) || '';
  }
}
