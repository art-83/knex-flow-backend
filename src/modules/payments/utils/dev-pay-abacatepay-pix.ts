import axios from 'axios';
import { abacatepayConfig } from '../../../config/abacatepay.config';

async function payAbacatepayPix(id: string) {
  const response = await axios.post(
    `${abacatepayConfig.apiUrl}/transparents/simulate-payment`,
    { metadata: {} },
    {
      params: { id },
      headers: {
        Authorization: `Bearer ${abacatepayConfig.apiKey}`,
      },
    },
  );

  return response.data;
}
export { payAbacatepayPix };
