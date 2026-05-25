import axios from 'axios';
import abacatepayConfig from '../../../config/abacatepay.config';

export async function payAbacatepayPix(external_id: string) {
  const response = await axios.post(`${abacatepayConfig.apiUrl}/transparents/pay`, {
    external_id,
  });

  return response.data;
}
