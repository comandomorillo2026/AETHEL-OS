# AETHEL OS - Acuerdo de Nivel de Servicio (SLA)

## Service Level Agreement para Clientes Enterprise

**Versión:** 1.0.0
**Fecha Efectiva:** Enero 2026
**Proveedor:** AETHEL OS

---

## 1. Disponibilidad del Servicio

### 1.1 Compromiso de Disponibilidad

| Plan | Disponibilidad Garantizada | Tiempo de Inactividad Máximo Mensual |
|------|---------------------------|-------------------------------------|
| **Starter** | 99.0% | 7.2 horas/mes |
| **Growth** | 99.5% | 3.6 horas/mes |
| **Premium (Enterprise)** | 99.9% | 43.2 minutos/mes |

### 1.2 Ventanas de Mantenimiento

- **Mantenimiento Programado:** Domingos 02:00 - 06:00 AST (Atlantic Standard Time)
- **Notificación:** Mínimo 48 horas de anticipación
- **Mantenimiento de Emergencia:** Se notificará con la mayor antelación posible

### 1.3 Exclusiones de Disponibilidad

El cálculo de disponibilidad NO incluye:
- Ventanas de mantenimiento programado
- Problemas causados por el cliente (configuración, código personalizado)
- Fuerza mayor (desastres naturales, huelgas, ataques DDoS)
- Problemas de proveedores externos (DNS, CDN de terceros)

---

## 2. Tiempos de Respuesta

### 2.1 Soporte Técnico

| Severidad | Definición | Tiempo de Respuesta | Tiempo de Resolución |
|-----------|------------|---------------------|---------------------|
| **Crítica (P1)** | Servicio completamente inoperable | 15 minutos | 4 horas |
| **Alta (P2)** | Funcionalidad principal afectada | 1 hora | 8 horas |
| **Media (P3)** | Funcionalidad secundaria afectada | 4 horas | 24 horas |
| **Baja (P4)** | Consultas generales, mejoras | 24 horas | Según acuerdo |

### 2.2 Canales de Soporte por Plan

| Plan | Canales de Soporte | Horario |
|------|-------------------|---------|
| Starter | Email | Lun-Vie 9:00-18:00 AST |
| Growth | Email, Chat | Lun-Vie 8:00-20:00 AST |
| Premium | Email, Chat, Teléfono, Slack | 24/7 |

---

## 3. Rendimiento del Sistema

### 3.1 Métricas de Rendimiento Garantizadas

| Métrica | Objetivo | Plan Aplicable |
|---------|----------|----------------|
| **Tiempo de respuesta API** | < 200ms (P95) | Todos |
| **Tiempo de carga de páginas** | < 2 segundos | Todos |
| **Disponibilidad de base de datos** | 99.99% | Todos |
| **Tiempo de procesamiento de reportes** | < 30 segundos | Premium |

### 3.2 Monitoreo Activo

- Monitoreo de salud cada 60 segundos
- Alertas automáticas para el equipo técnico
- Dashboard de estado en tiempo real: `status.aethel.tt`

---

## 4. Seguridad y Backup

### 4.1 Copias de Seguridad

| Tipo | Frecuencia | Retención | Planes |
|------|------------|-----------|--------|
| Backup incremental | Cada hora | 24 horas | Todos |
| Backup diario | Diario | 30 días | Todos |
| Backup mensual | Mensual | 12 meses | Growth, Premium |
| Backup anual | Anual | 7 años | Premium |

### 4.2 Recuperación ante Desastres

| Métrica | Objetivo |
|---------|----------|
| **RTO (Recovery Time Objective)** | 4 horas |
| **RPO (Recovery Point Objective)** | 1 hora |

### 4.3 Seguridad de Datos

- Encriptación en tránsito (TLS 1.3)
- Encriptación en reposo (AES-256)
- Auditoría de acceso a datos
- Cumplimiento GDPR/LGPD (bajo configuración)

---

## 5. Compensaciones por Incumplimiento

### 5.1 Créditos de Servicio

| Incumplimiento | Crédito |
|----------------|---------|
| Disponibilidad < 99.9% pero > 99% | 10% del cargo mensual |
| Disponibilidad < 99% pero > 95% | 25% del cargo mensual |
| Disponibilidad < 95% | 50% del cargo mensual |
| RTO excedido en incidente crítico | 5% adicional por hora de retraso |

### 5.2 Límites de Compensación

- Máximo de crédito: 100% del cargo mensual
- Los créditos no son acumulables
- Los créditos se aplican en la siguiente factura

### 5.3 Proceso de Reclamo

1. Cliente notifica incumplimiento dentro de 30 días
2. AETHEL verifica y calcula crédito correspondiente
3. Crédito aplicado en máximo 2 ciclos de facturación

---

## 6. Responsabilidades del Cliente

### 6.1 Requisitos Técnicos

- Navegador web actualizado (últimas 2 versiones)
- Conexión a internet estable (mínimo 5 Mbps)
- Dispositivos compatibles con estándares web modernos

### 6.2 Responsabilidades Operativas

- Mantener credenciales de acceso seguras
- Notificar cambios en personal con acceso
- Responder solicitudes de soporte en tiempo razonable
- Proporcionar información completa para resolución de incidentes

---

## 7. Términos Generales

### 7.1 Modificaciones al SLA

- Notificación de cambios: 30 días de anticipación
- Derecho de cancelación si cambios son inaceptables

### 7.2 Vigencia

- Este SLA entra en vigor al activar el servicio
- Se renueva automáticamente con cada ciclo de facturación

### 7.3 Contacto

- **Soporte Técnico:** soporte@aethel.tt
- **Ventas:** ventas@aethel.tt
- **Estado del Sistema:** status.aethel.tt

---

## Anexo A: Definiciones

| Término | Definición |
|---------|------------|
| **Disponibilidad** | Porcentaje de tiempo que el servicio está operativo |
| **Tiempo de inactividad** | Período en que el servicio no responde correctamente |
| **Incidente** | Evento que afecta la operación normal del servicio |
| **RTO** | Tiempo máximo para restaurar el servicio tras una interrupción |
| **RPO** | Máxima pérdida de datos tolerable medida en tiempo |

---

**© 2026 AETHEL OS - Todos los derechos reservados.**

*Este documento constituye un acuerdo vinculante entre AETHEL OS y sus clientes Enterprise.*
