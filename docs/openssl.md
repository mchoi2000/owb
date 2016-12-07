# openssl Commands
These are the commands used to generate the key/certificate setup for a local ssl/tls secure sever configuration.
Enter a pass-phrase when requested.

## Generate root CA key

```
openssl genrsa -aes256 -out rootCA.key 4096
```

## Generate root CA cert

```
openssl req -x509 -sha512 -new -nodes -key rootCA.key -days 65000 -out rootCA.crt
```

### Prompted Information
- C => US
- ST => Texas
- L => Austin
- O => IBM
- OU => Marketplace
- CN => workbench
- emailAddress => ibm@us.ibm.com


## Generate host key

```
openssl genrsa -out localhost.key 2048
```

## Generate signing request

### localhost.cnf
  A config file that enables for some extensions for generating multiple domain certificates. localhost.cnf is a copy of openssl.cnf(download it online @ http://web.mit.edu/crypto/openssl.cnf) with the following edits:  
1. Uncomment req_extensions = v3_req  
2. In [ v3_req ] section add:

```
subjectAltName = @alt_names
```

- Append this to the end of the file

```
[ alt_names ]

DNS.1 = localhost

DNS.2 = localhost.ibmserviceengage.com
```


```
openssl req -sha512 -new -key localhost.key -out localhost.csr -config localhost.cnf
```

### Prompted Information
- C => US
- ST => Texas
- L => Austin
- O => IBM
- OU => Marketplace
- CN => localhost
- emailAddress => ibm@us.ibm.com


## Generate host cert

```
openssl x509 -sha512 -req -in localhost.csr -CA rootCA.crt -CAkey rootCA.key -CAcreateserial -out localhost.crt -days 65000 -extfile localhost.cnf -extensions v3_req
```

## Package into pks

```
openssl pkcs12 -export -out localhost.pfx -inkey localhost.key -in localhost.crt
```
When prompted for an export password, leave it blank.

# Local configuration
To properly run the server locally, 

1. Place localhost.pfx and localhost.key files in server/certs under the operator-workbench project.

2. Install rootCA.crt on your system and/or browser.
