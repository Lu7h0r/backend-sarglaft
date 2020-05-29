var express = require('express');
var app = express();
var parseString = require('xml2js').parseString;
const axios = require('axios');

var a;

app.get('/', (req, res, next) => {
    /*
                    console.log('soap ok');
                    var soap = require('soap');
                    var url = 'https://www.w3.org/2003/05/soap-envelope/';
                    var args = { Envelope: 'value'};
                    soap.createClient(url, async function(err, client) {
                        var xml = client.wsdl;
                        if(xml) {            
                            parseString(xml['xml'], function (err, result) {
                                res.status(200).json({
                                    ok: true,
                                    soap: result,
                                });
                            });
                        } 
                    });*/
    samplePostCall();
    res.status(200).json({
        ok: true,
        soap: a,
    });
});

async function samplePostCall() {
    const baseURL =
        'http://www.informacolombia.com/InformaIntWeb/services/LaftXML';

    const data = `<?xml version="1.0" ?>
<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://servicioWebLAFT.informa">
<soapenv:Header/>
<soapenv:Body>
    <ser:obtenerLaftXMLUncoded soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
        <xmlLaftEntrada xsi:type="xsd:string">
         <![CDATA[
    <PETICION_PRODUCTO>
        <IDENTIFICACION>
            <USUARIO>IU12336</USUARIO>
            <PASSWORD>9KHZ4AX5KN</PASSWORD>
        </IDENTIFICACION>
    <PETICION_LAFT>
        <REG_CODIGO></REG_CODIGO>
        <REG_IDENTIFICACION>71984381</REG_IDENTIFICACION>
        <REG_NOMBRE></REG_NOMBRE>
        <REG_PARAM_MONITOREO>N</REG_PARAM_MONITOREO>
    </PETICION_LAFT>
    </PETICION_PRODUCTO>]]>
        </xmlLaftEntrada>
    </ser:obtenerLaftXMLUncoded>
</soapenv:Body>
</soapenv:Envelope>
`;

    try {
        const response = await axios.post(`${baseURL}`, data);
        console.log('resp ok');
        if (response) {
            if (response['config']) {
                // console.log(response['config']);
                parseString(response['config']['data'], function(err, result) {
                    a = result;
                    console.log(a);
                });
            }
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = app;