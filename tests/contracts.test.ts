import test from 'node:test';
import assert from 'node:assert';
import { CustomerSchema, CreateOrderPayloadSchema } from '../src/types/lavida';

test('HOEOS Law 4 & Law 11: Zero Fallback Architecture Enforced', () => {
  // Verify that client cannot submit prices in order payload
  const payloadWithClientPrice = {
    action: 'createOrder',
    idempotency_key: 'idem-uuid-12345-67890',
    order_type: 'takeaway',
    customer: {
      name: 'Chioma Okonkwo',
      phone: '+2348029998877',
      table_number: 'Table 02',
    },
    items: [
      {
        item_type: 'menu_item',
        item_id: 'lav-drink-001',
        quantity: 2,
        // Attacker attempting to inject client price
        price: 10,
        unit_price: 10,
      },
    ],
  };

  const parsed = CreateOrderPayloadSchema.safeParse(payloadWithClientPrice);
  assert.strictEqual(parsed.success, true, 'Payload should parse and strip or ignore client-injected prices');
  // Confirm that CreateOrderPayloadSchema item does not have price or unit_price in schema
  const item = parsed.data?.items[0] as any;
  assert.strictEqual(item.unit_price, undefined, 'Client price must never be part of validated order payload');
});

test('HOEOS Law 4: Customer Validation Schema', () => {
  // Invalid customer: missing name or too short
  const invalidName = CustomerSchema.safeParse({ name: 'A', phone: '+2348031234567' });
  assert.strictEqual(invalidName.success, false, 'Single letter name should fail validation');

  // Invalid customer: phone too short
  const invalidPhone = CustomerSchema.safeParse({ name: 'Adebayo Adeleke', phone: '123' });
  assert.strictEqual(invalidPhone.success, false, 'Short phone number should fail validation');

  // Valid customer
  const validCustomer = CustomerSchema.safeParse({
    name: 'Adebayo Adeleke',
    phone: '+2348031234567',
    table_number: 'Table 04',
  });
  assert.strictEqual(validCustomer.success, true, 'Valid customer must pass validation');
});

test('HOEOS Law 11: Secure Order Payload (Items and Idempotency)', () => {
  const validOrder = {
    action: 'createOrder',
    idempotency_key: 'idem-uuid-12345-67890',
    order_type: 'takeaway',
    customer: {
      name: 'Chioma Okonkwo',
      phone: '+2348029998877',
      table_number: 'Table 02',
    },
    items: [
      {
        item_type: 'menu_item',
        item_id: 'lav-drink-001',
        quantity: 2,
      },
    ],
  };

  const parsed = CreateOrderPayloadSchema.safeParse(validOrder);
  assert.strictEqual(parsed.success, true, 'Valid security order payload must parse cleanly');

  // Empty items array should fail
  const emptyItems = { ...validOrder, items: [] };
  const parsedEmpty = CreateOrderPayloadSchema.safeParse(emptyItems);
  assert.strictEqual(parsedEmpty.success, false, 'Empty items order must be rejected');
});
