## CMPT 431 - Assignment 02

## Summary

A SOAP web service that uses the Web Service Definition Language WSDL (written by hand) and is deployed using SimpleHTTPServer (express server). Also, a SOAP client accesses the service we have created, in order to perform the same clock synchronization scheme as in Assignment 1. Exchanged data is formatted to JSON string and is parsed back to JSON on both client and server side.

## Service

```xml
<wsdl:service name="ServerTimeService">
        <wsdl:port name="ServerTimeServiceSoapPort" binding="tns:ServerTimeServiceSoapBinding">
            <soap:address location="http://localhost:8080/wsdl" />
        </wsdl:port>
        <wsdl:port name="ServerTimeServiceSoap12Port" binding="tns:ServerTimeServiceSoap12Binding">
            <soap12:address location="http://localhost:8080/wsdl" />
        </wsdl:port>
    </wsdl:service>

```
