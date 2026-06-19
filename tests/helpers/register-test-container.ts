import { container } from 'tsyringe';

import { registerContainers } from '@/shared/containers/index.ts';
import { IPaymentGatewayProvider } from '@/modules/payments/infra/gateways/providers/payment-gateway.provider';
import { IMailerProvider } from '@/shared/infra/mailer/providers/mailer.provider';
import { IWebhookClientProvider } from '@/modules/observability/infra/webhook/providers/webhook-client.provider';
import { IProducerProvider } from '@/shared/infra/queue/infra/providers/producer.provider';
import { FakePaymentGateway } from '../mocks/fake-payment-gateway';
import { FakeMailer } from '../mocks/fake-mailer';
import { FakeWebhookClient } from '../mocks/fake-webhook-client';
import { FakeProducer } from '../mocks/fake-producer';

interface RegisterTestContainerOptions {
  useFakeExternals?: boolean;
}

const fakePaymentGateway = new FakePaymentGateway();
const fakeMailer = new FakeMailer();
const fakeWebhookClient = new FakeWebhookClient();
const fakeProducer = new FakeProducer();

function reRegisterTestFakes(): void {
  container.registerInstance<IPaymentGatewayProvider>('PixGatewayProvider', fakePaymentGateway);
  container.registerInstance<IMailerProvider>('MailerProvider', fakeMailer);
  container.registerInstance<IWebhookClientProvider>('WebhookClientProvider', fakeWebhookClient);
  container.registerInstance<IProducerProvider>('ProducerProvider', fakeProducer);
}

function registerTestContainer(options: RegisterTestContainerOptions = {}): void {
  const { useFakeExternals = true } = options;

  container.reset();
  registerContainers();

  if (useFakeExternals) {
    reRegisterTestFakes();
  }
}

function resetTestFakes(): void {
  fakePaymentGateway.payments = [];
  fakeMailer.sentEmails = [];
  fakeWebhookClient.posts = [];
  fakeProducer.jobs = [];
}

function getTestFakes() {
  return {
    paymentGateway: fakePaymentGateway,
    mailer: fakeMailer,
    webhookClient: fakeWebhookClient,
    producer: fakeProducer,
  };
}

export { registerTestContainer, resetTestFakes, reRegisterTestFakes, getTestFakes };
