//
// This file was generated by the JavaTM Architecture for XML Binding(JAXB) Reference Implementation, v2.2.4-2 
// See <a href="http://java.sun.com/xml/jaxb">http://java.sun.com/xml/jaxb</a> 
// Any modifications to this file will be lost upon recompilation of the source schema. 
// Generated on: 2016.02.25 at 03:58:45 PM GMT+03:00 
//


package uk.dsxt.voting.common.iso20022.jaxb;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for BeneficiaryCertificationType4Code.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="BeneficiaryCertificationType4Code">
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string">
 *     &lt;enumeration value="ACCI"/>
 *     &lt;enumeration value="DOMI"/>
 *     &lt;enumeration value="NDOM"/>
 *     &lt;enumeration value="FULL"/>
 *     &lt;enumeration value="NCOM"/>
 *     &lt;enumeration value="QIBB"/>
 *     &lt;enumeration value="TRBD"/>
 *     &lt;enumeration value="PAPW"/>
 *     &lt;enumeration value="PABD"/>
 *     &lt;enumeration value="FRAC"/>
 *   &lt;/restriction>
 * &lt;/simpleType>
 * </pre>
 * 
 */
@XmlType(name = "BeneficiaryCertificationType4Code")
@XmlEnum
public enum BeneficiaryCertificationType4Code {

    ACCI,
    DOMI,
    NDOM,
    FULL,
    NCOM,
    QIBB,
    TRBD,
    PAPW,
    PABD,
    FRAC;

    public String value() {
        return name();
    }

    public static BeneficiaryCertificationType4Code fromValue(String v) {
        return valueOf(v);
    }

}