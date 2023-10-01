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

  public FECAESolicitar(tipo: string): string {
    if (tipo.toLowerCase() === 'c')
      return `<?xml version="1.0" encoding="utf-8"?>
      <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
        <soap12:Body>
          <FECAESolicitar xmlns="http://ar.gov.afip.dif.FEV1/">
            <Auth>
              <Token></Token>
              <Sign></Sign>
              <Cuit></Cuit>
            </Auth>
            <FeCAEReq>
              <FeCabReq>
                <CantReg>1</CantReg>
                <PtoVta></PtoVta>
                <CbteTipo>11</CbteTipo>
              </FeCabReq>
              <FeDetReq>
                <FECAEDetRequest>
                  <MonId>PES</MonId>
                  <MonCotiz>1</MonCotiz>
                  <Concepto>1</Concepto>
                  <CbteFch></CbteFch>
                  <DocTipo></DocTipo>
                  <DocNro></DocNro>
                  <CbteDesde></CbteDesde>
                  <CbteHasta></CbteHasta>
                  <ImpTotal></ImpTotal>
                  <ImpNeto></ImpNeto>
                </FECAEDetRequest>
              </FeDetReq>
            </FeCAEReq>
          </FECAESolicitar>
        </soap12:Body>
      </soap12:Envelope>`;
    return ``;
  }















}
