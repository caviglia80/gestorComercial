export class AfipRequest {

  public FEDummy(): string {
    return `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xmlns:xsd="http://www.w3.org/2001/XMLSchema"
      xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <FEDummy xmlns="http://ar.gov.afip.dif.FEV1/"/>
      </soap:Body>
    </soap:Envelope>`;
  }

  public FEParamGetPtosVenta(): string {
    return `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ar="http://ar.gov.afip.dif.FEV1/">
    <soapenv:Header/>
    <soapenv:Body>
      <FEParamGetPtosVenta xmlns="http://ar.gov.afip.dif.FEV1/">
        <Auth>
          <Token></Token>
          <Sign></Sign>
          <Cuit></Cuit>
        </Auth>
      </FEParamGetPtosVenta>
    </soapenv:Body>
  </soapenv:Envelope>`;
  }

















}
