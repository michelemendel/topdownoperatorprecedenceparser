export const code1 = `

`;

export const code = `
title:"Empower report 986 on hub 4203"

config {
  hub: 4203
  //DATA SOURCES 
  table accounts: fromcrmconnector.SFDCAccounts_v6_0_1  //accounts custom table
  table contacts: contacts.response // contact database
  table finance: EmpowerKPI.EmpowerKPI
  
  table opportunities : fromcrmconnector.FiveYrsClosedOpportunities_v6_0_1
  table weight : WeightModel.WeightModel
  table LeadScore : fromcrmconnector.SFDCContactMktoLeadScore // Marketing lead score by contact
  table confirmitid : ConfirmitCompanyID.ConfirmitCompanyID //stores Confirmit company IDs linked to SFDC AccountID
  table licenses : EndUserLicenses.EndUserLicenses // licensed and assigned
  table usage : RVAUsage.RVAUsage // rolling month RVA Usage
  table reference : ConfirmitCompanyIDReference.ConfirmitCompanyIDReference // stores unique confirmit id lookup
  table hierarchysurvey : SDFCAccountsHierarchy.respondent //Accounts Hierarchy Imported to survey db

  //FEEDBACK SOURCES
  table relationship : relationship.response  //relationship survey
  table respondent : relationship.respondent  //relationship respondent table
  table training : training.response    //training survey
  table teamcheck : teamcheck.response  //internal team check survey
  table teamcheckresp : teamcheck.respondent //internal team check respondent
  table website : website.response // 
  table clientandteam : combinedREL_TC.response //relationpgeship + teamcheck

  //ACTION MANAGEMENT

  //HIERARCHIES
  table hierarchy : dbdesigner.660
  table hierarchy : dbdesigner.21039

  //CALENDAR
  table calendar : crmdata.CalendarMonths
  table calendar : custom.CalendarMonths

  //RELATIONS BETWEEN TABLES
  relation oneToMany {
    primaryKey: todo //accounts:id // CHANGED
    foreignKey: usage:FullAccountID
  }

  //accounts --> opportunities
  relation oneToMany {
    primaryKey: todo //accounts:Id //CHANGED
    foreignKey: opportunities:AccountId //CHANGED
  }

  //accounts --> confirmitID
  relation oneToMany {
    primaryKey: todo //accounts:id
    foreignKey: confirmitid:FullAccountID
  }
  //referenceid--> confirmitid 
  relation oneToMany {
    primaryKey: todo //reference:ConfirmitId
    foreignKey: todo //confirmitid:ConfirmitId
  }
  
  //account -id--> licenses 
  relation oneToMany {
    primaryKey: todo //confirmitid:ConfirmitId
    foreignKey: todo //licenses:ConfirmitId
  }

  // accounts --> Team Check respondent --> Team Check Survey
  relation oneToOne {
    primaryKey: todo //accounts:id
    foreignKey: todo //teamcheckresp:AccountID
  }

  // accounts --> contact db
  relation oneToMany {
    primaryKey: todo //accounts:id
    foreignKey: todo //contacts:AccountID
  }
  //marketing lead score ---contacts
  relation oneToMany {
    primaryKey: todo //accounts:id
    foreignKey: todo //LeadScore:AccountId
  }
  relation oneToMany {
    primaryKey: todo //hierarchy:id
    foreignKey: todo //accounts:id
  }

  relation oneToOne {
    primaryKey: todo //calendar:Month
    foreignKey: todo //finance:Month
  }
    
  // accounts --> Hierarchy Survey
  relation oneToOne {
    primaryKey: todo //accounts:id
    foreignKey: todo //hierarchysurvey:AccountID
  }
}
  
//DERIVED VARIABLES

//For response rate reporting
variable singleChoice #responseStatus {
  table: todo //respondent:
  label: "Status"
  value: todo //IIF(@filter.isResponded, "c", IIF(@filter.isOptOut, "o", IIF(@filter.isPartial, "p", IIF(@filter.isFailedInvite, "f", IIF(@filter.isNotYetSent, "ns", "n")))))

  option code {
    code: "ns"
    label: "Not Yet Sent"
  }

  option code {
    code: "f"
    label: "Failed invites"
  }

  option code {
    code: "o"
    label: "Opt-Outs"
  }

  option code {
    code: "n"
    label: "Not responded"
  }

  option code {
    code: "p"
    label: "Partial response"
  }

  option code {
    code: "c"
    label: "Full response"
  }
}
  
//For portfolio breakdown legend
variable singleChoice #loyalty {
  label: "Loyalty"
  table: todo //relationship:
  option code {
    code: "Loyal"
    score: 1
    label: "Loyal"
  }
  option code {
    code: "Indifferent"
    score: 2
    label: "Indifferent"
  }
  option code {
    code: "At Risk"
    score: 3
    label: "At Risk"
  }
  value: todo //IIF(score(relationship:Q1) >= 9, "Loyal", IIF(score(relationship:Q1) >= 7, "Indifferent", IIF(score(relationship:Q1) < 7, "At Risk")))
}
  
variable singleChoice #mr {
  table: todo //accounts:
  label: "mr"
  option code {
    label: "Less 100k"
    code: "l"
    score: 1
  }
  option code {
    label: "100k..300k"
    code: "m"
    score: 2
  }
  option code {
    label: "More 500k"
    code: "o"
    score: 3
  }
  value: todo //IIF(accounts:TotalAccountValue_USD < 100000, "l", IIF(accounts:TotalAccountValue_USD > 500000, "o", "m"))
}
   
variable singleChoice #mrm {
  table: todo //accounts:
  label: "mr"
  option code {
    label: "More 500k"
    code: "o"
    score: 3
  }
  option code {
    label: "100k..300k"
    code: "m"
    score: 2
  }
  option code {
    label: "Less 100k"
    code: "l"
    score: 1
  }
  value: todo //IIF(accounts:TotalAccountValue_USD < 100000, "l", IIF(accounts:TotalAccountValue_USD > 500000, "o", "m"))
}
  
//need to correct this. riskgroups is teamcheck only
variable singleChoice #riskgroups {
  label: "Risk"
  table: todo //accounts:
  option code {
    code: "Safe"
    score: 1
    label: "Safe"
  }
  option code {
    code: "Medium"
    score: 2
    label: "Medium Risk"
  }
  option code {
    code: "High"
    score: 3
    label: "High Risk"
  }
  option code {
    code: "Unknown"
    score: 4
    label: "Unknown"
  }

  value: todo //IIF(@calculate.riskassessment = 10, "Safe", IIF(@calculate.riskassessment = 5, "Medium", IIF(@calculate.riskassessment = 0, "High", "Unknown")))

}
  
variable singleChoice #sClientType {
  label: "Client Type"
  table: todo //accounts:
  option code {
    code: "MR"
    score: 1
    label: "MR"
  }
  option code {
    code: "VoC"
    score: 2
    label: "VoC"
  }
  option code {
    code: "VoE"
    score: 3
    label: "VoE"
  }
  option code {
    code: "Unknown"
    score: 4
    label: "Unknown"
  }
  value: todo //IIF(accounts:ClientType = "MR", "MR", IIF(accounts:ClientType = "VoC", "VoC", IIF(accounts:ClientType = "VoE", "VoE", "Unknown")))
}
  
variable singleChoice #sTypeOfCustomer {
  label: "Type of Customer"
  table: todo //accounts:
  option code {
    code: "1"
    score: 1
    label: "Self service"
  }
  option code {
    code: "2"
    score: 2
    label: "Hybrid"
  }
  option code {
    code: "3"
    score: 3
    label: "Managed Services"
  }
  option code {
    code: "4"
    score: 4
    label: "Panel / Sample provider"
  }

  option code {
    code: "5"
    score: 5
    label: "Fieldwork agency"
  }

  option code {
    code: "6"
    score: 6
    label: "Full Service Agency"
  }

  option code {
    code: "7"
    score: 7
    label: "Outsourcing / Scripting Services"
  }

  option code {
    code: "Unknown"
    score: 7
    label: "Unknown"
  }

  value: todo //IIF(teamcheck:Q13 = "1", "1", IIF(teamcheck:Q13 = "2", "2", IIF(teamcheck:Q13 = "3", "3", IIF(teamcheck:Q13 = "4", "4", IIF(teamcheck:Q13 = "5", "5", IIF(teamcheck:Q13 = "6", "6", IIF(teamcheck:Q13 = "7", "7", "Unknown")))))))
}
  
variable singleChoice #sAccountTeam {
  label: "Account Team"
  table: todo //accounts:
  option code {
    code: "1"
    score: 1
    label: "1) Nordic VoC"
  }
  option code {
    code: "2"
    score: 2
    label: "2) EMEA VoC"
  }
  option code {
    code: "3"
    score: 3
    label: "3) EMEA MR"
  }
  option code {
    code: "4"
    score: 4
    label: "4) Russia"
  }

  option code {
    code: "5"
    score: 5
    label: "5) APAC"
  }

  option code {
    code: "6"
    score: 6
    label: "6) US VoC"
  }

  option code {
    code: "7"
    score: 7
    label: "7) Global VoE"
  }

  option code {
    code: "8"
    score: 8
    label: "8) US MR"
  }

  option code {
    code: "Unkown"
    score: 9
    label: "Unkown"
  }
  value: todo //IIF(accounts:SalesRegion = "1) Nordic VoC", "1", IIF(accounts:SalesRegion = "2) EMEA VoC", "2", IIF(accounts:SalesRegion = "3) EMEA MR", "3", IIF(accounts:SalesRegion = "4) Russia", "4", IIF(accounts:SalesRegion = "5) APAC", "5", IIF(accounts:SalesRegion = "6) US VoC", "6", IIF(accounts:SalesRegion = "7) Global VoE", "7", IIF(accounts:SalesRegion = "8) US MR", "8", "Unknown"))))))))
}
    
variable auto #respCount {
  table: todo //accounts:
  label: "RespondentCount"
  value:todo //COUNT(respondent:respid)
}
  
//   variable singleChoice accountActivityStatus {
//     label: "Active and/or Surveyed"
//     table: todo //accounts:
//     //showFilter:false
//     option code {
//       code: "1"
//       score: 1
//       label: "Active and/or Surveyed"
//     }
//     option code {
//       code: "2"
//       score: 2
//       label: "InActive and not surveyed"
//     }
//     //value: todo //IIF(COUNT(respondent:respid,@daterange.L12MonthRelResp AND respondent:noOfEmailsSent > 0 AND respondent:smtpStatus != "NonDeliveryReport" ) > 0 OR COUNT(teamcheck:responseid,@daterange.L12MonthTC) > 0 OR accounts:ActiveClient="True","1","2")
//     value: todo //IIF(COUNT(respondent:respid, @daterange.L12MonthRelResp AND respondent:noOfEmailsSent > 0 AND respondent:smtpStatus != "NonDeliveryReport") > 0 OR accounts:ActiveClient = "True", "1", "2")
//   }

drillDown #accountOwner {
  filter expression {
    value: todo //IIF((accounts:ActiveClient = "True" OR respondent:noOfEmailsSent > 0) AND respondent:smtpStatus != "NonDeliveryReport", true, false)
  }
  
  level distinct {
    table:todo //accounts:
    value: todo //accounts:AccountOwnerName
  }
}

drillDown #salesRegion {
  level distinct {
    table: todo //accounts:
    value: todo //accounts:SalesRegion
  }
}

#numberFormatter = {
  logo: "/isa/BDJPFRDMEYBPBKLVADAYFQCDAVIOEQJR/EMPOWER/EmpowerLogo_dk.png"

  //NUMERIC & DATE FORMATS
  formatter date #long {
    formatString: "DD MMM YYYY"
    emptyValue: "None"
  }
  formatter date #monthlabel {
    inputFormat: "YYYYMM"
    formatString: "MMM"
  }

  formatter date #quarterlabel {
    inputFormat: "YYYYQQ"
    formatString: "'YY Qo"
  }

  formatter value #emptyvalue {
    emptyValue: " "
  }
  formatter number #UScurrency {
    numberDecimals: 0
    prefix: "$ "
    //decimalSeparator: ""
    integerSeparator: " "
    shortForm: true
  }
  formatter number #nodecimal {
    numberDecimals: 0
    decimalSeparator: "."
    shortForm: true
    emptyValue: "-"
  }

  formatter number #nodecimalblank {
    numberDecimals: 0
    decimalSeparator: "."
    shortForm: true
    emptyValue: "NA"
  }

  formatter number #onedecimal {
    numberDecimals: 1
    decimalSeparator: "."
    integerSeparator: ","
    shortForm: false
  }
  formatter number #twodecimal {
    numberDecimals: 2
    decimalSeparator: "."
    integerSeparator: ","
    shortForm: false
  }

  formatter number #percentage {
    numberDecimals: 0
    decimalSeparator: "."
    postfix: " %"
  }
  formatter number #percentageonedecimal {
    numberDecimals: 1
    decimalSeparator: "."
    postfix: " %"
  }
  formatter number #UScurrency {
    numberDecimals: 0
    prefix: "$ "
    //decimalSeparator: ""
    integerSeparator: " "
    shortForm: true
  }
  formatter number #nodecimal {
    numberDecimals: 0
    decimalSeparator: "."
    shortForm: true
    emptyValue: "-"
  }
  
  formatter number #nodecimalblank {
    numberDecimals: 0
    decimalSeparator: "."
    shortForm: true
    emptyValue: "NA"
  }
  
  formatter number #onedecimal {
    numberDecimals: 1
    decimalSeparator: "."
    integerSeparator: ","
    shortForm: false
  }
  formatter number #twodecimal {
    numberDecimals: 2
    decimalSeparator: "."
    integerSeparator: ","
    shortForm: false
  }
  
  formatter number #percentage {
    numberDecimals: 0
    decimalSeparator: "."
    postfix: " %"
  }
  formatter number #percentageonedecimal {
    numberDecimals: 1
    decimalSeparator: "."
    postfix: " %"
  }
}

#formatterMisc = {
  logo: "/isa/BDJPFRDMEYBPBKLVADAYFQCDAVIOEQJR/EMPOWER/EmpowerLogo_dk.png"

  //NUMERIC & DATE FORMATS
  formatter date #long {
    formatString: "DD MMM YYYY"
    emptyValue: "None"
  }
  formatter date #monthlabel {
    inputFormat: "YYYYMM"
    formatString: "MMM"
  }

  formatter date #quarterlabel {
    inputFormat: "YYYYQQ"
    formatString: "'YY Qo"
  }

  formatter value #emptyvalue {
    emptyValue: " "
  }
}

#formatterColors = {
  //STYLES: COLOR PALETTES & CONDITIONAL FORMATTING

  //COLOR PALETTES
  formatter color #metricbar {
    thresholds:todo //#0F5E7D >= 1
  }

  //CONDITIONAL FORMATTING
  formatter color #npsGauge {
    thresholds:todo // #82D854 >= 20, #FFBD5B >= 10, #FA5263 >=-100
  }
  formatter color #NetSalesGauge {
    thresholds:todo // #82D854 >= 100, #FFBD5B >= 95,#FA5263 >= 0
  }
  formatter color #RenewalRateGauge {
    thresholds:todo // #82D854 >= 95, #FFBD5B >= 90,#FA5263 >= 0
  }
  formatter color #acrossTheJourney {
    thresholds:todo // #5ba35d >= 8, #ffa156 >= 6.5, #dd3435 >= 0
  }
  formatter color #scorecolor1 {
    thresholds:todo // #7ED251 >=4 , #F0AD4E >=2, #FA5263 >=1
  }
  formatter color #percentcolor {
    thresholds:todo // #82D854 >= 100%, #FFBD5B >= 70%, #FA5263 < 70%
  }
  formatter color #calloutred {
    thresholds:todo // #ff0000 >=1, #31363e >=0
  }
  formatter color #NPScellcolor {
    thresholds:todo // #5CB85C >= 40, #F0AD4E >= 15, #FA5263 >= 0
  }
  formatter color #NPStextcolor {
    thresholds:todo // #333333 >= 40, #333333 >= 15, #ffffff >= 0
  }
  formatter color #NPSgroupcellcolor {
    thresholds:todo // #5CB85C = 1, #F0AD4E = 2, #FA5263 = 3
  }
  formatter color #metriccellcolor {
    thresholds: todo // #5CB85C >= 8.5, #F0AD4E >= 6.5, #FA5263 >= 0
  }
  formatter color #metrictextcolor {
    thresholds: todo // #ffffff >= 8.5, #ffffff >= 6.5, #ffffff >= 0
  }
  formatter color #metricgrouptextcolor {
    thresholds: todo // #ffffff >=1, #ffffff >= 2, #ffffff >=3
  }
  formatter color #riskleveltextcolor {
    thresholds: todo // #FFFFFF >=9, #333333 >=5, #FFFFFF <5
  }
  formatter color #risklevelcellcolor {
    //thresholds: todo // #5CB85C >=9, #F0AD4E >=5, #FA5263 <5
    thresholds: todo // #FA5263 = 0, #F0E598 = 5, #82D854 = 10 //rgba(0, 0, 0, 0) >= 0
    //thresholds: todo // #82D854 = 10, #F0E598 = 5, #FA5263 = 0
  }

  //TEST CDL FORMATTERS from demo - bg color formatters not working in this report
  formatter color #backgroundColorFormatter {
    thresholds: todo // #7ED251 >=9, #FFBB5C >= 7, #F76373 >= 0
  }
  formatter color #valueColorFormatter {
    thresholds: todo // #333333 >=9, #333333 >=7, #ffffff >= 0
  }
  formatter color #riskTextColorFormatter {
    thresholds: todo // #FFFFFF = 0, #333333 = 5, #FFFFFF = 10
  }
  formatter color #riskTextBgColorFormatter {
    thresholds: todo // #FA5263 = 0, #F0AD4E = 5, #82D854 = 10
  }
  formatter color #adoptionTextColorFormatter {
    thresholds: todo // #FFFFFF >= 10, #333333 >= 5,#FFFFFF <5
  }
  formatter color #adoptionTextBgColorFormatter {
    thresholds: todo // #82D854 >= 10,  #F0AD4E >= 5,#FA5263 <5
  }
  //END TEST CDL formatters from demo


  //RECODED LABELS
  formatter color #loyaltygroups {
    thresholds: todo // Loyal >= 8.5, Passive >= 6.5, Unlikely >= 0
  }
  formatter color #NPSgroups {
    thresholds: todo // Promoter >= 8.5, Passive >= 6.5, Detractor >= 0
  }
  formatter color #NPSgroupsContacts {
    thresholds: todo // Silent < 0, Promoter >= 8.5, Passive >= 6.5, Detractor >= 0
  }
  formatter color #usertrend {
    thresholds: todo // Low <0, Low >=0, Medium =5, High >=10
  }
  formatter color #usagetrend {
    thresholds: todo // Decline < 0, Static >= 5, Growth >=10
  }
  formatter color #adoptionrate {
    thresholds: todo // Low >= 0 , Medium >= 5, Active >= 10
  }
  formatter color #spendtrend {
    thresholds: todo // Growth >= 10, Static >=5, Decline < 5
  }
  formatter color #LeadScore {
    thresholds: todo // High >= 10, Medium >=5, Low >= 0
  }
  formatter color #risklevel {
    thresholds: todo // Safe = 10, Med = 5, High = 0
    //reverse scale created for temp workaround display in metrics summary tile
  }
  formatter color #feelingrisklevel {
    thresholds: todo // Safe >= 9.5, Medium >=6.5, High >= 0
    //reverse scale created for temp workaround display in metrics summary tile
  }
  formatter color #feelingrisklevel2 {
    thresholds: todo // LowRisk >= 10, MediumRisk >=5, HighRisk >= 0
  }
  formatter color #indexrisklevel {
    thresholds: todo // LowRisk >= 10, MediumRisk >=5, HighRisk >= 0
  }
  formatter color #keyaccountflag {
    thresholds: todo // Y = 1, N = 0
  }
}

#someFilters = {
  //CUSTOM PROPERTIES: FILTER EXPRESSIONS, SEGMENTS, DATE RANGES

  custom properties #filter {
    //FILTER EXPRESSIONS
    isSent: todo //respondent:noOfEmailsSent > 0
  }

  custom properties #filter {
    //FILTER EXPRESSIONS
    isSent: respondent:noOfEmailsSent > 0
    isResponded: relationship:status = "complete"
    isPartial: relationship:status = "incomplete"
    isFailedInvite: respondent:smtpStatus != "messageSent" AND respondent:noOfEmailsSent > 0
    isNotYetSent: respondent:noOfEmailsSent = 0 AND respondent:smtpStatus != "messageSent"
    isOptOut: todo //respondent:OptOut = "3" OR respondent:OptOut = "6"
    isClientResponse: todo //IIF(count(relationship:respid) > 0, 1, 0)
    isTeamResponse: todo //IIF(count(teamcheck:responseid) > 0, 1, 0)
  }

  //FIXED REPORTING PERIODS
  custom properties #daterange {

  //RELATONSHIP SURVEY
  currentPeriodRev: todo //IIF(@timeperiod.selectedOption.label = "Last 3 Months", @daterange.L3MonthRev, IIF(@timeperiod.selectedOption.label = "Last 6 Months", @daterange.L6MonthRev, IIF(@timeperiod.selectedOption.label = "Last 12 Months", @daterange.L12MonthRev, IIF(@timeperiod.selectedOption.label = "Current Calendar Year", @daterange.CCalYearRev, @daterange.L12MonthRev))))
  previousPeriodRev: todo //IIF(@timeperiod.selectedOption.label = "Last 3 Months", @daterange.P3MonthRev, IIF(@timeperiod.selectedOption.label = "Last 6 Months", @daterange.P6MonthRev, IIF(@timeperiod.selectedOption.label = "Last 12 Months", @daterange.P12MonthRev, IIF(@timeperiod.selectedOption.label = "Current Calendar Year", @daterange.PCalYearRev, @daterange.P12MonthRev))))


  L3MonthRev: todo //Between(opportunities:CloseDate, AddMonth(GetDate(), -3), GetDate()) AND opportunities:IsClosed = "true"
  P3MonthRev: todo //Between(opportunities:CloseDate, AddMonth(GetDate(), -6), AddMonth(GetDate(), -3)) AND opportunities:IsClosed = "true"

  L6MonthRev: todo //Between(opportunities:CloseDate, AddMonth(GetDate(), -6), GetDate()) AND opportunities:IsClosed = "true"
  P6MonthRev: todo //Between(opportunities:CloseDate, AddMonth(GetDate(), -12), AddMonth(GetDate(), -6)) AND opportunities:IsClosed = "true"

  L12MonthRev: todo //Between(opportunities:CloseDate, AddYear(GetDate(), -1), GetDate()) AND opportunities:IsClosed = "true"
  P12MonthRev: todo //Between(opportunities:CloseDate, AddYear(GetDate(), -2), AddYear(GetDate(), -1)) AND opportunities:IsClosed = "true"


  //to be updated.
  CCalYearRev: todo //InYear(opportunities:CloseDate, 0, 0) AND opportunities:IsClosed = "true"
  PCalYearRev: todo //InYear(opportunities:CloseDate, -1, -1) AND opportunities:IsClosed = "true"

  //RELATONSHIP SURVEY
  currentPeriodRel: todo //IIF(@timeperiod.selectedOption.label = "Last 3 Months", @daterange.L3MonthRel, IIF(@timeperiod.selectedOption.label = "Last 6 Months", @daterange.L6MonthRel, IIF(@timeperiod.selectedOption.label = "Last 12 Months", @daterange.L12MonthRel, IIF(@timeperiod.selectedOption.label = "Current Calendar Year", @daterange.CCalYearRel, @daterange.L12MonthRel))))
  previousPeriodRel: todo //IIF(@timeperiod.selectedOption.label = "Last 3 Months", @daterange.P3MonthRel, IIF(@timeperiod.selectedOption.label = "Last 6 Months", @daterange.P6MonthRel, IIF(@timeperiod.selectedOption.label = "Last 12 Months", @daterange.P12MonthRel, IIF(@timeperiod.selectedOption.label = "Current Calendar Year", @daterange.PCalYearRel, @daterange.P12MonthRel))))
  currentPeriodRelResp: todo //IIF(@timeperiod.selectedOption.label = "Last 3 Months", @daterange.L3MonthRelResp, IIF(@timeperiod.selectedOption.label = "Last 6 Months", @daterange.L6MonthRelResp, IIF(@timeperiod.selectedOption.label = "Last 12 Months", @daterange.L12MonthRelResp, IIF(@timeperiod.selectedOption.label = "Current Calendar Year", @daterange.CCalYearRelResp, @daterange.L12MonthRelResp))))

  L3MonthRel: todo //Between(relationship:FirstMailedDate, AddMonth(GetDate(), -3), GetDate())
  P3MonthRel: todo //Between(relationship:FirstMailedDate, AddMonth(GetDate(), -6), AddMonth(GetDate(), -3))
  L3MonthRelResp: todo //Between(respondent:FirstEmailedDate, AddMonth(GetDate(), -3), GetDate())

  L6MonthRel:todo //Between(relationship:FirstMailedDate, AddMonth(GetDate(), -6), GetDate())
  P6MonthRel:todo //Between(relationship:FirstMailedDate, AddMonth(GetDate(), -12), AddMonth(GetDate(), -6))
  L6MonthRelResp:todo //Between(respondent:FirstEmailedDate, AddMonth(GetDate(), -6), GetDate())

  L12MonthRel:todo //Between(relationship:FirstMailedDate, AddYear(GetDate(), -1), GetDate())
  P12MonthRel:todo //Between(relationship:FirstMailedDate, AddYear(GetDate(), -2), AddYear(GetDate(), -1))
  L12MonthRelResp:todo //Between(respondent:FirstEmailedDate, AddYear(GetDate(), -1), GetDate())

  //to be updated.
  CCalYearRel:todo //InYear(relationship:FirstMailedDate, 0, 0)
  PCalYearRel:todo //InYear(relationship:FirstMailedDate, -1, -1)
  CCalYearRelResp:todo //InYear(respondent:FirstEmailedDate, 0, 0)

  //TEAM CHECK SURVEYM    
  currentPeriodTC:todo //IIF(@timeperiod.selectedOption.label = "Last 3 Months", @daterange.L3MonthTC, IIF(@timeperiod.selectedOption.label = "Last 6 Months", @daterange.L6MonthTC, IIF(@timeperiod.selectedOption.label = "Last 12 Months", @daterange.L12MonthTC, IIF(@timeperiod.selectedOption.label = "Current Calendar Year", @daterange.CCalYearTC, @daterange.L12MonthTC))))
  previousPeriodTC:todo //IIF(@timeperiod.selectedOption.label = "Last 3 Months", @daterange.P3MonthTC, IIF(@timeperiod.selectedOption.label = "Last 6 Months", @daterange.P6MonthTC, IIF(@timeperiod.selectedOption.label = "Last 12 Months", @daterange.P12MonthTC, IIF(@timeperiod.selectedOption.label = "Current Calendar Year", @daterange.PCalYearTC, @daterange.P12MonthTC))))
  currentPeriodTCResp:todo //IIF(@timeperiod.selectedOption.label = "Last 3 Months", @daterange.L3MonthTCResp, IIF(@timeperiod.selectedOption.label = "Last 6 Months", @daterange.L6MonthTCResp, IIF(@timeperiod.selectedOption.label = "Last 12 Months", @daterange.L12MonthTCResp, IIF(@timeperiod.selectedOption.label = "Current Calendar Year", @daterange.CCalYearTCResp, @daterange.L12MonthTCResp))))

  L3MonthTC:todo //Between(teamcheck:FirstMailedDate, AddMonth(GetDate(), -4), AddMonth(GetDate(), -1))
  P3MonthTC:todo //Between(teamcheck:FirstMailedDate, AddMonth(GetDate(), -7), AddMonth(GetDate(), -4))
  L3MonthTCResp:todo //Between(teamcheckresp:FirstEmailedDate, AddMonth(GetDate(), -4), AddMonth(GetDate(), -1))

  L6MonthTC:todo //Between(teamcheck:FirstMailedDate, AddMonth(GetDate(), -7), AddMonth(GetDate(), -1))
  P6MonthTC:todo //Between(teamcheck:FirstMailedDate, AddMonth(GetDate(), -13), AddMonth(GetDate(), -7))
  L6MonthTCResp:todo //Between(teamcheckresp:FirstEmailedDate, AddMonth(GetDate(), -7), AddMonth(GetDate(), -1))

  L12MonthTC:todo //Between(teamcheck:FirstMailedDate, AddMonth(AddYear(GetDate(), -1), -1), AddMonth(GetDate(), -1))
  P12MonthTC:todo //Between(teamcheck:FirstMailedDate, AddMonth(AddYear(GetDate(), -2), -1), AddMonth(AddYear(GetDate(), -1), -1))
  L12MonthTCResp:todo //Between(teamcheckresp:FirstEmailedDate, AddMonth(AddYear(GetDate(), -1), -1), AddMonth(GetDate(), -1))


  CCalYearTC:todo //InYear(teamcheck:FirstMailedDate, 0, 0) //AND NOT Between(teamcheck:FirstMailedDate , AddMonth(GetDate(), -1),GetDate())
  PCalYearTC:todo //InYear(teamcheck:FirstMailedDate, -1, -1)
  CCalYearTCResp:todo //InYear(teamcheckresp:FirstEmailedDate, 0, 0) //AND NOT Between(teamcheckresp:FirstEmailedDate, AddMonth(GetDate(), -1),GetDate())
  //CASES
  // currentPeriodCases:todo //IIF(@timeperiod.selectedOption.label = "Last 3 Months", @daterange.L3MonthCases, IIF(@timeperiod.selectedOption.label = "Last 6 Months", @daterange.L6MonthCases, IIF(@timeperiod.selectedOption.label = "Last 12 Months", @daterange.L12MonthCases, IIF(@timeperiod.selectedOption.label = "Current Calendar Year", @daterange.CCalYearCases, @daterange.L12MonthCases))))
  // previousYearCases:todo //IIF(@timeperiod.selectedOption.label = "Last 3 Months", @daterange.P3MonthCases, IIF(@timeperiod.selectedOption.label = "Last 6 Months", @daterange.P6MonthCases, IIF(@timeperiod.selectedOption.label = "Last 12 Months", @daterange.P12MonthCases, IIF(@timeperiod.selectedOption.label = "Current Calendar Year", @daterange.PCalYearCases, @daterange.P12MonthCases))))

  // L3MonthCases:todo //Between(cases:DateCreated, AddMonth(GetDate(), -3), GetDate())
  // P3MonthCases:todo //Between(cases:DateCreated, AddMonth(GetDate(), -6), AddMonth(GetDate(), -3))

  // L6MonthCases:todo //Between(cases:DateCreated, AddMonth(GetDate(), -6), GetDate())
  // P6MonthCases:todo //Between(cases:DateCreated, AddMonth(GetDate(), -12), AddMonth(GetDate(), -6))

  // L12MonthCases:todo //Between(cases:DateCreated, AddYear(GetDate(),-1), GetDate())
  // P12MonthCases:todo //Between(cases:DateCreated, AddYear(GetDate(), -2),AddYear(GetDate(),-1))

  // CCalYearCases:todo //InYear(cases:DateCreated, 0, 0)
  // PCalYearCases:todo //InYear(cases:DateCreated, -1, -1)

  // REL AND TC COMBINED
  currentPeriodTRCom:todo //IIF(@timeperiod.selectedOption.label = "Last 3 Months", @daterange.L3MonthTRCom, IIF(@timeperiod.selectedOption.label = "Last 6 Months", @daterange.L6MonthTRCom, IIF(@timeperiod.selectedOption.label = "Last 12 Months", @daterange.L12MonthTRCom, IIF(@timeperiod.selectedOption.label = "Current Calendar Year", @daterange.CCalYearTRCom, @daterange.L12MonthTRCom))))
  previousYearTRCom:todo //IIF(@timeperiod.selectedOption.label = "Last 3 Months", @daterange.P3MonthTRCom, IIF(@timeperiod.selectedOption.label = "Last 6 Months", @daterange.P6MonthTRCom, IIF(@timeperiod.selectedOption.label = "Last 12 Months", @daterange.P12MonthTRCom, IIF(@timeperiod.selectedOption.label = "Current Calendar Year", @daterange.PCalYearTRCom, @daterange.P12MonthTRCom))))

  L3MonthTRCom:todo //Between(clientandteam:RelationshipSurveyDate, AddMonth(GetDate(), -3), GetDate())
  P3MonthTRCom:todo //Between(clientandteam:RelationshipSurveyDate, AddMonth(GetDate(), -6), AddMonth(GetDate(), -3))

  L6MonthTRCom:todo //Between(clientandteam:RelationshipSurveyDate, AddMonth(GetDate(), -6), GetDate())
  P6MonthTRCom:todo //Between(clientandteam:RelationshipSurveyDate, AddMonth(GetDate(), -12), AddMonth(GetDate(), -6))

  L12MonthTRCom:todo //Between(clientandteam:RelationshipSurveyDate, AddYear(GetDate(), -1), GetDate())
  P12MonthTRCom:todo //Between(clientandteam:RelationshipSurveyDate, AddYear(GetDate(), -2), AddYear(GetDate(), -1))

  CCalYearTRCom:todo //InYear(clientandteam:RelationshipSurveyDate, 0, 0)
  PCalYearTRCom:todo //InYear(clientandteam:RelationshipSurveyDate, -1, -1)

  // Finance
  currentPeriodFin:todo //IIF(@timeperiod.selectedOption.label = "Last 3 Months", @daterange.L3MonthFin, IIF(@timeperiod.selectedOption.label = "Last 6 Months", @daterange.L6MonthFin, IIF(@timeperiod.selectedOption.label = "Last 12 Months", @daterange.L12MonthFin, IIF(@timeperiod.selectedOption.label = "Current Calendar Year", @daterange.CCalYearFin, @daterange.L12MonthFin))))

  L3MonthFin:todo //InQuarter(finance:month, -1, -1)
  L6MonthFin:todo //InQuarter(finance:month, -2, -1)
  L12MonthFin:todo //InQuarter(finance:month, -4, -1)
  CCalYearFin:todo //InYear(finance:month, 0, 0) //AND NOT  Between(finance:month, AddMonth(GetDate(), -1), GetDate())
} relationship:status = "complete"
    isPartial: relationship:status = "incomplete"
    isFailedInvite: respondent:smtpStatus != "messageSent" AND respondent:noOfEmailsSent > 0
    isNotYetSent: respondent:noOfEmailsSent = 0 AND respondent:smtpStatus != "messageSent"
    isOptOut: respondent:OptOut = "3" OR respondent:OptOut = "6"
    isClientResponse:todo //IIF(count(relationship:respid) > 0, 1, 0)
    isTeamResponse:todo //IIF(count(teamcheck:responseid) > 0, 1, 0)
  }

  //FIXED REPORTING PERIODS
  custom properties #daterange {

  //RELATONSHIP SURVEY
  currentPeriodRev:todo //IIF(@timeperiod.selectedOption.label = "Last 3 Months", @daterange.L3MonthRev, IIF(@timeperiod.selectedOption.label = "Last 6 Months", @daterange.L6MonthRev, IIF(@timeperiod.selectedOption.label = "Last 12 Months", @daterange.L12MonthRev, IIF(@timeperiod.selectedOption.label = "Current Calendar Year", @daterange.CCalYearRev, @daterange.L12MonthRev))))
  previousPeriodRev:todo //IIF(@timeperiod.selectedOption.label = "Last 3 Months", @daterange.P3MonthRev, IIF(@timeperiod.selectedOption.label = "Last 6 Months", @daterange.P6MonthRev, IIF(@timeperiod.selectedOption.label = "Last 12 Months", @daterange.P12MonthRev, IIF(@timeperiod.selectedOption.label = "Current Calendar Year", @daterange.PCalYearRev, @daterange.P12MonthRev))))


  L3MonthRev:todo //Between(opportunities:CloseDate, AddMonth(GetDate(), -3), GetDate()) AND opportunities:IsClosed = "true"
  P3MonthRev:todo //Between(opportunities:CloseDate, AddMonth(GetDate(), -6), AddMonth(GetDate(), -3)) AND opportunities:IsClosed = "true"

  L6MonthRev:todo //Between(opportunities:CloseDate, AddMonth(GetDate(), -6), GetDate()) AND opportunities:IsClosed = "true"
  P6MonthRev:todo //Between(opportunities:CloseDate, AddMonth(GetDate(), -12), AddMonth(GetDate(), -6)) AND opportunities:IsClosed = "true"

  L12MonthRev:todo //Between(opportunities:CloseDate, AddYear(GetDate(), -1), GetDate()) AND opportunities:IsClosed = "true"
  P12MonthRev:todo //Between(opportunities:CloseDate, AddYear(GetDate(), -2), AddYear(GetDate(), -1)) AND opportunities:IsClosed = "true"


  //to be updated.
  CCalYearRev:todo //InYear(opportunities:CloseDate, 0, 0) AND opportunities:IsClosed = "true"
  PCalYearRev:todo //InYear(opportunities:CloseDate, -1, -1) AND opportunities:IsClosed = "true"

  //RELATONSHIP SURVEY
  currentPeriodRel:todo //IIF(@timeperiod.selectedOption.label = "Last 3 Months", @daterange.L3MonthRel, IIF(@timeperiod.selectedOption.label = "Last 6 Months", @daterange.L6MonthRel, IIF(@timeperiod.selectedOption.label = "Last 12 Months", @daterange.L12MonthRel, IIF(@timeperiod.selectedOption.label = "Current Calendar Year", @daterange.CCalYearRel, @daterange.L12MonthRel))))
  previousPeriodRel:todo //IIF(@timeperiod.selectedOption.label = "Last 3 Months", @daterange.P3MonthRel, IIF(@timeperiod.selectedOption.label = "Last 6 Months", @daterange.P6MonthRel, IIF(@timeperiod.selectedOption.label = "Last 12 Months", @daterange.P12MonthRel, IIF(@timeperiod.selectedOption.label = "Current Calendar Year", @daterange.PCalYearRel, @daterange.P12MonthRel))))
  currentPeriodRelResp:todo //IIF(@timeperiod.selectedOption.label = "Last 3 Months", @daterange.L3MonthRelResp, IIF(@timeperiod.selectedOption.label = "Last 6 Months", @daterange.L6MonthRelResp, IIF(@timeperiod.selectedOption.label = "Last 12 Months", @daterange.L12MonthRelResp, IIF(@timeperiod.selectedOption.label = "Current Calendar Year", @daterange.CCalYearRelResp, @daterange.L12MonthRelResp))))

  L3MonthRel:todo //Between(relationship:FirstMailedDate, AddMonth(GetDate(), -3), GetDate())
  P3MonthRel:todo //Between(relationship:FirstMailedDate, AddMonth(GetDate(), -6), AddMonth(GetDate(), -3))
  L3MonthRelResp:todo //Between(respondent:FirstEmailedDate, AddMonth(GetDate(), -3), GetDate())

  L6MonthRel:todo //Between(relationship:FirstMailedDate, AddMonth(GetDate(), -6), GetDate())
  P6MonthRel:todo //Between(relationship:FirstMailedDate, AddMonth(GetDate(), -12), AddMonth(GetDate(), -6))
  L6MonthRelResp:todo //Between(respondent:FirstEmailedDate, AddMonth(GetDate(), -6), GetDate())

  L12MonthRel:todo //Between(relationship:FirstMailedDate, AddYear(GetDate(), -1), GetDate())
  P12MonthRel:todo //Between(relationship:FirstMailedDate, AddYear(GetDate(), -2), AddYear(GetDate(), -1))
  L12MonthRelResp:todo //Between(respondent:FirstEmailedDate, AddYear(GetDate(), -1), GetDate())

  //to be updated.
  CCalYearRel:todo //InYear(relationship:FirstMailedDate, 0, 0)
  PCalYearRel:todo //InYear(relationship:FirstMailedDate, -1, -1)
  CCalYearRelResp:todo //InYear(respondent:FirstEmailedDate, 0, 0)

  //TEAM CHECK SURVEYM    
  currentPeriodTC:todo //IIF(@timeperiod.selectedOption.label = "Last 3 Months", @daterange.L3MonthTC, IIF(@timeperiod.selectedOption.label = "Last 6 Months", @daterange.L6MonthTC, IIF(@timeperiod.selectedOption.label = "Last 12 Months", @daterange.L12MonthTC, IIF(@timeperiod.selectedOption.label = "Current Calendar Year", @daterange.CCalYearTC, @daterange.L12MonthTC))))
  previousPeriodTC:todo //IIF(@timeperiod.selectedOption.label = "Last 3 Months", @daterange.P3MonthTC, IIF(@timeperiod.selectedOption.label = "Last 6 Months", @daterange.P6MonthTC, IIF(@timeperiod.selectedOption.label = "Last 12 Months", @daterange.P12MonthTC, IIF(@timeperiod.selectedOption.label = "Current Calendar Year", @daterange.PCalYearTC, @daterange.P12MonthTC))))
  currentPeriodTCResp:todo //IIF(@timeperiod.selectedOption.label = "Last 3 Months", @daterange.L3MonthTCResp, IIF(@timeperiod.selectedOption.label = "Last 6 Months", @daterange.L6MonthTCResp, IIF(@timeperiod.selectedOption.label = "Last 12 Months", @daterange.L12MonthTCResp, IIF(@timeperiod.selectedOption.label = "Current Calendar Year", @daterange.CCalYearTCResp, @daterange.L12MonthTCResp))))

  L3MonthTC:todo //Between(teamcheck:FirstMailedDate, AddMonth(GetDate(), -4), AddMonth(GetDate(), -1))
  P3MonthTC:todo //Between(teamcheck:FirstMailedDate, AddMonth(GetDate(), -7), AddMonth(GetDate(), -4))
  L3MonthTCResp:todo //Between(teamcheckresp:FirstEmailedDate, AddMonth(GetDate(), -4), AddMonth(GetDate(), -1))

  L6MonthTC:todo //Between(teamcheck:FirstMailedDate, AddMonth(GetDate(), -7), AddMonth(GetDate(), -1))
  P6MonthTC:todo //Between(teamcheck:FirstMailedDate, AddMonth(GetDate(), -13), AddMonth(GetDate(), -7))
  L6MonthTCResp:todo //Between(teamcheckresp:FirstEmailedDate, AddMonth(GetDate(), -7), AddMonth(GetDate(), -1))

  L12MonthTC:todo //Between(teamcheck:FirstMailedDate, AddMonth(AddYear(GetDate(), -1), -1), AddMonth(GetDate(), -1))
  P12MonthTC:todo //Between(teamcheck:FirstMailedDate, AddMonth(AddYear(GetDate(), -2), -1), AddMonth(AddYear(GetDate(), -1), -1))
  L12MonthTCResp:todo //Between(teamcheckresp:FirstEmailedDate, AddMonth(AddYear(GetDate(), -1), -1), AddMonth(GetDate(), -1))


  CCalYearTC:todo //InYear(teamcheck:FirstMailedDate, 0, 0) //AND NOT Between(teamcheck:FirstMailedDate , AddMonth(GetDate(), -1),GetDate())
  PCalYearTC:todo //InYear(teamcheck:FirstMailedDate, -1, -1)
  CCalYearTCResp:todo //InYear(teamcheckresp:FirstEmailedDate, 0, 0) //AND NOT Between(teamcheckresp:FirstEmailedDate, AddMonth(GetDate(), -1),GetDate())
  //CASES
  // currentPeriodCases:todo //IIF(@timeperiod.selectedOption.label = "Last 3 Months", @daterange.L3MonthCases, IIF(@timeperiod.selectedOption.label = "Last 6 Months", @daterange.L6MonthCases, IIF(@timeperiod.selectedOption.label = "Last 12 Months", @daterange.L12MonthCases, IIF(@timeperiod.selectedOption.label = "Current Calendar Year", @daterange.CCalYearCases, @daterange.L12MonthCases))))
  // previousYearCases:todo //IIF(@timeperiod.selectedOption.label = "Last 3 Months", @daterange.P3MonthCases, IIF(@timeperiod.selectedOption.label = "Last 6 Months", @daterange.P6MonthCases, IIF(@timeperiod.selectedOption.label = "Last 12 Months", @daterange.P12MonthCases, IIF(@timeperiod.selectedOption.label = "Current Calendar Year", @daterange.PCalYearCases, @daterange.P12MonthCases))))

  // L3MonthCases:todo //Between(cases:DateCreated, AddMonth(GetDate(), -3), GetDate())
  // P3MonthCases:todo //Between(cases:DateCreated, AddMonth(GetDate(), -6), AddMonth(GetDate(), -3))

  // L6MonthCases:todo //Between(cases:DateCreated, AddMonth(GetDate(), -6), GetDate())
  // P6MonthCases:todo //Between(cases:DateCreated, AddMonth(GetDate(), -12), AddMonth(GetDate(), -6))

  // L12MonthCases:todo //Between(cases:DateCreated, AddYear(GetDate(),-1), GetDate())
  // P12MonthCases:todo //Between(cases:DateCreated, AddYear(GetDate(), -2),AddYear(GetDate(),-1))

  // CCalYearCases:todo //InYear(cases:DateCreated, 0, 0)
  // PCalYearCases:todo //InYear(cases:DateCreated, -1, -1)

  // REL AND TC COMBINED
  currentPeriodTRCom:todo //IIF(@timeperiod.selectedOption.label = "Last 3 Months", @daterange.L3MonthTRCom, IIF(@timeperiod.selectedOption.label = "Last 6 Months", @daterange.L6MonthTRCom, IIF(@timeperiod.selectedOption.label = "Last 12 Months", @daterange.L12MonthTRCom, IIF(@timeperiod.selectedOption.label = "Current Calendar Year", @daterange.CCalYearTRCom, @daterange.L12MonthTRCom))))
  previousYearTRCom:todo //IIF(@timeperiod.selectedOption.label = "Last 3 Months", @daterange.P3MonthTRCom, IIF(@timeperiod.selectedOption.label = "Last 6 Months", @daterange.P6MonthTRCom, IIF(@timeperiod.selectedOption.label = "Last 12 Months", @daterange.P12MonthTRCom, IIF(@timeperiod.selectedOption.label = "Current Calendar Year", @daterange.PCalYearTRCom, @daterange.P12MonthTRCom))))

  L3MonthTRCom:todo //Between(clientandteam:RelationshipSurveyDate, AddMonth(GetDate(), -3), GetDate())
  P3MonthTRCom:todo //Between(clientandteam:RelationshipSurveyDate, AddMonth(GetDate(), -6), AddMonth(GetDate(), -3))

  L6MonthTRCom:todo //Between(clientandteam:RelationshipSurveyDate, AddMonth(GetDate(), -6), GetDate())
  P6MonthTRCom:todo //Between(clientandteam:RelationshipSurveyDate, AddMonth(GetDate(), -12), AddMonth(GetDate(), -6))

  L12MonthTRCom:todo //Between(clientandteam:RelationshipSurveyDate, AddYear(GetDate(), -1), GetDate())
  P12MonthTRCom:todo //Between(clientandteam:RelationshipSurveyDate, AddYear(GetDate(), -2), AddYear(GetDate(), -1))

  CCalYearTRCom:todo //InYear(clientandteam:RelationshipSurveyDate, 0, 0)
  PCalYearTRCom:todo //InYear(clientandteam:RelationshipSurveyDate, -1, -1)

  // Finance
  currentPeriodFin:todo //IIF(@timeperiod.selectedOption.label = "Last 3 Months", @daterange.L3MonthFin, IIF(@timeperiod.selectedOption.label = "Last 6 Months", @daterange.L6MonthFin, IIF(@timeperiod.selectedOption.label = "Last 12 Months", @daterange.L12MonthFin, IIF(@timeperiod.selectedOption.label = "Current Calendar Year", @daterange.CCalYearFin, @daterange.L12MonthFin))))

  L3MonthFin:todo //InQuarter(finance:month, -1, -1)
  L6MonthFin:todo //InQuarter(finance:month, -2, -1)
  L12MonthFin:todo //InQuarter(finance:month, -4, -1)
  CCalYearFin:todo //InYear(finance:month, 0, 0) //AND NOT  Between(finance:month, AddMonth(GetDate(), -1), GetDate())
}

//ELEMENT INDEX SCORES
custom properties #index {
  NPSavg:todo //average(score(relationship:Q1), @daterange.L12MonthRel)
  NEEDSavg:todo //average(score(relationship:Q12), @daterange.L12MonthRel)
  VALUEavg:todo //average(score(relationship:Q3), @daterange.L12MonthRel)
  RELavg:todo //average(score(relationship:Q4), @daterange.L12MonthRel)
  TECHavg:todo //average(score(relationship:Q7), @daterange.L12MonthRel)

  //CLIENT FEELING INDEX SCORES
  NPS:todo //IIF(@index.NPSavg > 0, IIF(@index.NPSavg >= 9, 10, IIF(@index.NPSavg >= 7, 5, 0)), 0)
  Needs:todo //IIF(@index.NEEDSavg > 0, IIF(@index.NEEDSavg >= 9, 10, IIF(@index.NEEDSavg >= 7, 5, 0)), 0)
  Value:todo //IIF(@index.VALUEavg > 0, IIF(@index.VALUEavg >= 9, 10, IIF(@index.VALUEavg >= 7, 5, 0)), 0)
  Relationship:todo //IIF(@index.RELavg > 0, IIF(@index.RELavg >= 9, 10, IIF(@index.RELavg >= 7, 5, 0)), 0)
  Technology:todo //IIF(@index.TECHavg > 0, IIF(@index.TECHavg >= 9, 10, IIF(@index.TECHavg >= 7, 5, 0)), 0)

  tNPSavg:todo //average(score(teamcheck:Q1), @daterange.L12MonthTC)
  RENEWavg:todo //average(score(teamcheck:Q2), @daterange.L12MonthTC)
  BENavg:todo //average(score(teamcheck:Q8), @daterange.L12MonthTC)
  EXPavg:todo //average(score(teamcheck:Q9), @daterange.L12MonthTC)

  //TEAM FEELING INDEX SCORES
  tNPS:todo //IIF(@index.tNPSavg > 0, IIF(@index.tNPSavg >= 9, 10, IIF(@index.tNPSavg >= 7, 5, 0)), 0)
  Renew:todo //IIF(@index.RENEWavg > 0, IIF(@index.RENEWavg >= 9, 10, IIF(@index.RENEWavg >= 7, 5, 0)), 0)
  Benefits:todo //IIF(@index.BENavg > 0, IIF(@index.BENavg >= 9, 10, IIF(@index.BENavg >= 7, 5, 0)), 0)
  Experience:todo //IIF(@index.EXPavg > 0, IIF(@index.EXPavg >= 9, 10, IIF(@index.EXPavg >= 7, 5, 0)), 0)

  //CLIENT BEHAVIOUR INDEX SCORES - FROM DEMO: NEEDS REWRITE ONCE ALL DATA IS IN PLACE
  SpendTrend:todo //IIF(@calculate.revdiff < -10, 0, IIF(@calculate.revdiff > 10, 10, 5))
  UserAdoption:todo //IIF(@calculate.usage > 75, 10, IIF(@calculate.usage < 40, 0, 5))
  LeadScore:todo //IIF(average(LeadScore:mkto71_Lead_Score) > 75, 10, IIF(average(LeadScore:mkto71_Lead_Score) < 40, 0, 5))
  ResponseRate:todo //IIF(@calculate.responserateL12M > 50, 10, IIF(@calculate.responserateL12M < 40, 0, 5))
}

//WEIGHT MODEL - Not currently functioning correctly as table look up. Hard coded values for interim
custom properties #weight {
  //ELEMENT WEIGHTS
  //CLIENT FEELING ELEMENTS
  NPS: .05 //average(weight:ELEMENTWEIGHT, weight:METRICID = "FC1") //Q1
  Needs: .40 //average(weight:ELEMENTWEIGHT, weight:METRICID = "FC2") //Q12
  Value: .15 //average(weight:ELEMENTWEIGHT, weight:METRICID = "FC3") //Q3
  Relationship: .10 //average(weight:ELEMENTWEIGHT, weight:METRICID = "FC4") //Q4
  Technology: .30 //average(weight:ELEMENTWEIGHT, weight:METRICID = "FC5") //Q7
  //TEAM FEELING ELEMENTS
  tNPS: .05 //average(weight:ELEMENTWEIGHT, weight:METRICID = "FE1") //Q1
  Renew: .40 //average(weight:ELEMENTWEIGHT, weight:METRICID = "FE2") //Q2
  Benefits: .15 //average(weight:ELEMENTWEIGHT, weight:METRICID = "FE3") //Q8
  Experience: .40 //average(weight:ELEMENTWEIGHT, weight:METRICID = "FE4") //Q9
  //DOING ELEMENTS - Currently all equally weighted - so not referenced in widget CDL at this time
  ResponseRate: .10 //average(weight:ELEMENTWEIGHT, weight:METRICID = "DC2")
  LeadScore: .10 // average(weight:ELEMENTWEIGHT, weight:METRICID = "DM1") //MarketingLeadScore
  SpendTrend: .60 //average(weight:ELEMENTWEIGHT, weight:METRICID = "DS1") //YoY Revenue
  UserAdoption: .20 //average(weight:ELEMENTWEIGHT, weight:METRICID = "DT3") //RVA Licensed vs Active
  //FOCUS WEIGHTS
  clientfeeling: .30
  teamfeeling: .30
  doing: .40
}

//DIMENSION SCORES
custom properties #dimension {
  //CLIENT FEELING DIMENSION SCORES
  clientfeeling: @index.NPSavg * @weight.NPS + @index.NEEDSavg * @weight.Needs + @index.VALUEavg * @weight.Value + @index.RELavg * @weight.Relationship + @index.TECHavg * @weight.Technology
  clientfeelingIDX: @index.NPS * @weight.NPS + @index.Needs * @weight.Needs + @index.Value * @weight.Value + @index.Relationship * @weight.Relationship + @index.Technology * @weight.Technology

  //TEAM FEELING DIMENSION SCORES 
  teamfeeling: @index.tNPSavg * @weight.tNPS + @index.RENEWavg * @weight.Renew + @index.BENavg * @weight.Benefits + @index.EXPavg * @weight.Experience
  teamfeelingIDX: @index.tNPS * @weight.tNPS + @index.Renew * @weight.Renew + @index.Benefits * @weight.Benefits + @index.Experience * @weight.Experience

  //DOING DIMENSION SCORES
  doing: @index.ResponseRate * @weight.ResponseRate + @index.SpendTrend * @weight.SpendTrend + @index.LeadScore * @weight.LeadScore + @index.UserAdoption * @weight.UserAdoption
}

//CALCULATIONS
custom properties #calculate {
  //STANDARD CALCULATIONS
  revL12M:todo //sum(opportunities:Amount_USD, @daterange.L12MonthRev)
  revP12M:todo //sum(opportunities:Amount_USD, @daterange.P12MonthRev)
  revdiff: (@calculate.revL12M - @calculate.revP12M) / @calculate.revL12M * 100
  salesperformance: (Sum(finance:NetsalesquotaachievementAmericasVoC) + Sum(finance:NetsalesquotaachievementAmericasMR) + Sum(finance:NetsalesquotaachievementGlobalVoE) + Sum(finance:NetsalesquotaachievementNordicsVoC) + Sum(finance:NetsalesquotaachievementEMEAVoC) + Sum(finance:NetsalesquotaachievementEMEAMR) + Sum(finance:NetsalesquotaachievementAustralia) + Sum(finance:NetsalesquotaachievementRussia)) / 8 * 100
  currActiveUser:todo //sum(usage:uniqueLogins, InMonth(usage:Month, 0, 1))
  prevActiveUser:todo //sum(usage:uniqueLogins, InMonth(usage:Month, 0, 2))
  usersLicenses:todo //sum(licenses:purchased, licenses:EUType = "RVA")
  usersAssigned:todo //sum(licenses:users, licenses:EUType = "RVA")
  usage:todo //sum(licenses:users) / sum(licenses:purchased) * 100

  responserate:todo //COUNT(relationship:responseId, relationship:status = "complete" OR relationship:status = "incomplete") * 100 / COUNT(respondent:respid, respondent:noOfEmailsSent > 0 AND respondent:smtpStatus != "NonDeliveryReport")
  responserateL12M:todo //COUNT(relationship:responseId, (relationship:status = "complete" OR relationship:status = "incomplete") AND InDay(relationship:FirstMailedDate, DiffDay(GetDate(), AddDay(AddYear(GetDate(), -1), 1)), 0)) * 100 / COUNT(respondent:respid, respondent:smtpStatus != "NonDeliveryReport" AND InDay(respondent:FirstEmailedDate, DiffDay(GetDate(), AddDay(AddYear(GetDate(), -1), 1)), 0))

  //RISK CALCULATIONS - PENDING REWRITE ONCE ALL DATA ELEMENTS ARE IN PLACE
  sumofdimensions: @dimension.clientfeelingIDX * @weight.clientfeeling + @dimension.teamfeelingIDX * @weight.teamfeeling + @dimension.doing * @weight.doing
  sumofdimensionsIDX: @dimension.clientfeelingIDX + @dimension.teamfeelingIDX + @dimension.doing
  riskassessment:todo //IIF(@calculate.sumofdimensionsIDX >= 50, 10, IIF(@calculate.sumofdimensionsIDX < 15, 0, 5))
}

custom properties #targets {
  NPS: 20 // NEED TO CHANGE TO A DYN
}


//FILTER PANEL
layoutArea toolbar {

  filter hierarchy {
    label: "Sales Organisation"
    hierarchy: hierarchy:660
    //  hierarchy: hierarchy:21039
    optionLabel: hierarchy:language_text
  }

  filter drillDown {
    drillDown: accountOwner
    label: "Account Owner"
  }

  filter multiselect #AccountTeam {
    label: "Account Team"
    optionsFrom:todo //accounts:sAccountTeam
  }

  filter multiselect #clientType {
    label: "Client Type"
    optionsFrom:todo //accounts:sClientType
  }

  filter multiselect #industries {
    label: "Industry"
    optionsFrom:todo //accounts:Industry
  }

  // filter multiselect productsUsed {
  //   label: "Products Used (Team Check)"
  //   optionsFrom: teamcheck:Q14MULTI
  // }

  filter multiselect #typeofcustomer {
    label: "Type of Customer"
    optionsFrom:todo //accounts:sTypeOfCustomer
  }

  filter multiselect #role {
    label: "Role"
    option checkbox #r1 {
      label: "Decision maker"
      value: contacts:contactRole = "Decision maker"
    }
    option checkbox #r2 {
      label: "Influencer"
      value: contacts:contactRole = "Influencer"
    }
    option checkbox #r3 {
      label: "Champion/Coach"
      value: contacts:contactRole = "Champion/Coach"
    }
    option checkbox #r4 {
      label: "User"
      value: contacts:contactRole = "User"
    }
    option checkbox #r5 {
      label: "Admin/PA"
      value: contacts:contactRole = "Admin/PA"
    }
    option checkbox #r6 {
      label: "Procurement"
      value: contacts:contactRole = "Procurement"
    }
    option checkbox #r7 {
      label: "Other"
      value: contacts:contactRole = "Procurement"
    }
  }

  filter multiselect #annualaccountvalue {
    label: "Revenue - Last 12 Months"
    option checkbox #r1 {
      label: "< $50K"
      value:todo //accounts:ltrL12MRev < 50000
    }
    option checkbox #r2 {
      label: "$50k-$99k"
      value: todo //Between(accounts:ltrL12MRev, 50000, 99999.99)
    }
    option checkbox #r3 {
      label: "$100k-$249k"
      value: todo //Between(accounts:ltrL12MRev, 100000, 249999.99)
    }
    option checkbox #r4 {
      label: "$250k-$499k"
      value: todo //Between(accounts:ltrL12MRev, 250000, 499999.99)
    }
    option checkbox #r5 {
      label: "$500k-$999k"
      value: todo //Between(accounts:ltrL12MRev, 500000, 999999.99)
    }
    option checkbox #r6 {
      label: "$1m+"
      value: todo //accounts:ltrL12MRev > 999999.99
    }
  }


  filter singleselect #timeperiod {
    label: "Time Period"
    option checkbox #r1 {
      label: "Last 3 Months"
      value: todo //accounts:id != ""
    }
    option checkbox #r2 {
      label: "Last 6 Months"
      value: todo //accounts:id != ""
    }
    option checkbox #r3 {
      label: "Last 12 Months"
      value: todo //accounts:id != ""
      selected: true
    }
    option checkbox #r4 {
      label: "Current Calendar Year"
      value: todo //accounts:id != ""
    }
  }

  filter singleselect #accountactivitystatus {
    hide: true
    label: "Account Activity Status"
    option checkbox #r3 {
      label: "Active Client"
      value: todo //accounts:accountActivityStatus = "1"
      //selected: true
    }
    option checkbox #r4 {
      label: "Inactive Client"
      value: todo //accounts:accountActivityStatus = "2"
    }
  }
}


page #PortfolioHealth {
  label: "Portfolio Health"

  widget summary {
    size: large
    table:todo //accounts:

    infobox {
      label: "Top Level Summary"
      info: "The top level summary widget provides a quick view of the current performance within the dimensions used to identify level of risk based on the applied hierarchy filter. The Risk calculation is a weighted index that examines the customers feelings (as measured by our Empower program), behavior (measured through our financial and Salesforce data), and our alignment with their feelings (as measured by our VoCe program)."
    }
    tile risk {
      label: "Portfolio Overall Risk"
      showThermometer: false
      value: 5
      //      value: @calculate.riskassessment
      //textValue: "Test"
      textValue: todo //IIF(@calculate.riskassessment = 0, "High", IIF(@calculate.riskassessment = 5, "Medium", IIF(@calculate.riskassessment = 10, "Safe")))
      min: 0
      max: 5
      target: 10
      renewal: todo //min(accounts:AccountRenewalDate, InMonth(accounts:AccountRenewalDate, 1, 5))
      //revenue: todo //sum(opportunities:Amount_USD, @daterange.L12MonthRev)
    }
    tile metric {
      label: "Client Behaviour"
      value: @dimension.doing
      target: 10
    }
    tile metric {
      label: "Client Feeling"
      showThermometer: false
      value: @dimension.clientfeelingIDX
      target: 10
      //format: feelingrisklevel2
    }
    tile metric {
      label: "Team Feeling"
      value: @dimension.teamfeelingIDX
      target: 10
      //format: feelingrisklevel2
    }
  }
  widget markdown {

    infobox {
      label: "Risk Modeller"
      info: "TBC"
    }

    size: small
    label: "Risk Modeller"
    navigateTo: "Accounts"
    markdown: "![Risk Factors](http://survey.euro.confirmit.com/isa/BDJPFRDMEYBPBKLVADAYFQCDAVIOEQJR/Empower_Risk_Factors_Image_Draft_4.png)"
  }

  //WIDGET NOT WORKING - CANNOT HAVE MULTIPLE SOURCES ON ONE CHART WHERE SOME SOURCES DO NOT HAVE DIRECT
  //RELATIONSHIPS WITH EACH OTHER.
  widget chart {

    infobox {
      label: "Overall Risk Trend"
      info: "NA"
    }

    filter expression {
      value: @daterange.currentPeriodRel
    //filtertype: "preAggregate"
    }

    label: "Overall Risk Trend"
     //palette: "#2B3E50","#DF691A","#4bf442"
    palette: "#2B3E50","#54bc23"
    size: medium
    legend: bottomCenter
    gridLines: none
    removeEmptyCategories: true

    // chart area {
    //   lineType: monotone
    // }

    chart line {
      //lineType: basis
      dotSize: 5

    }

    // series #ss1 {
    //   value: @dimension.doing
    //   format: percentageonedecimal
    //   label: "Client Behaviour"
    // }
    series #ss2 {
      value: @dimension.clientfeelingIDX
      format: percentageonedecimal
      label: "Client Feeling"

    }

    //  series #ss3 {
    //   value: @dimension.teamfeelingIDX
    //   format: percentageonedecimal
    //   label: "Team Feeling"
    // }

    series #ss3 {
      value: 7
      format: valueDefaultFormatter
      label: "target"
      chart line {
        lineType: linear
        dotSize: 0
      }
    }

    category overlappingDate {
      //value: relationship:FirstMailedDate
      value: relationship:FirstMailedDate
      breakdownBy: calendarMonth
      start: "-13 month"  // THIS NEEDS TO BE DYNAMIC BASED ON PERIOD SELCTED.    
      end: "0 days"
      startShift: "-12 month"
      endShift: "0 month"

    }
  }

  widget responseRate {

    // infobox {
    //   label: "Feedback Response Rate"
    //   info: "widget provides a breakdown of the possible response categories for the relationship survey for the last 12 months."
    // }

    size: small
    label: "Feedback Response Rate"

    table: respondent:

    tile statuses {
      breakBy: respondent:responseStatus // derived variable in config hub block
      value:todo //COUNT(respondent:responseStatus)
      //      value:todo //COUNT(respondent:responseStatus, @daterange.currentPeriodRelResp)
      chart: "bar"
      isNotYetSent: respondent:noOfEmailsSent = 0 AND respondent:smtpStatus != "messageSent"
    isOptOut: todo //respondent:OptOut = "3" OR respondent:OptOut = "6"
      //format:
      percentFormat: percentDefaultFormatter
      //navigateTo: "Response Management"
    }

    //ISSUE HERE - WHY IS IT NOT TAKING THE RIGHT COUNTS FOR NO EMAILED
    tile value {
      label: "Invitations Delivered"
      //value: todo //count(respondent:respid)
      value: todo //count(respondent:respid, (@daterange.currentPeriodRelResp AND respondent:noOfEmailsSent > 0) AND respondent:smtpStatus != "NonDeliveryReport")
      //format: responsesFormat
    }
    tile value {
      label: "Response rate"
      format: percentage
      value: todo //count(relationship:responseid, (@filter.isResponded OR @filter.isPartial) AND @daterange.currentPeriodRel) * 100 / count(respondent:respid, (@daterange.currentPeriodRelResp AND respondent:noOfEmailsSent > 0) AND respondent:smtpStatus != "NonDeliveryReport") // invite sent in 2018
    }
  }



  widget barChart #revenuerisk {

    infobox {
      label: "Revenue Risk 6mth Forecast"
      info: "The Revenue Risk 6mth Forecast widget ..."
    }
    table:todo //accounts:
    label: "Revenue Risk - 6mth Forecast"
    size: medium
    navigateTo:todo //accountsinSegment

    category date {
      value:todo //accounts:AccountRenewalDate
      breakdownBy: calendarMonth
      format: monthlabel
      start: "0 months"
      end: "6 months"
      removeEmpty: true
    }
    series cut {
      value:todo //accounts:riskgroups
    }

    value: todo //sum(opportunities:Amount_USD, @daterange.L12MonthRev)
    format: UScurrency
  }



  // widget barChart {

  //   infobox {
  //     label: "Alert Type by Status"
  //     info: "The Alert Type by Status widget shows a view of all the types of alerts created for the filtered portfolio by status for the last 12 months. Clicking on a specific segment/bar will open the Customer Alerts page, filtered to show only those cases related to the selected segment/bar."
  //   }

  //   table: cases:  //accounts:

  //   filter expression {
  //     value: @daterange.currentPeriodCases
  //     filtertype: "preAggregate"
  //   }

  //   label: "Alert Type by Status"
  //   size: medium
  //   value:todo //COUNT(cases:caseId)
  //   format: nodecimal
  //   palette: "#cccccc","#FFBB5C","#CF2740","#0F5E7D","#CCCCCC","#333333","#F58533","#F9BF00","#F18500","#F30000","#AA0010","#C0C0C0"
  //   navigateTo: "Customer Alerts"
  //   category cut {
  //     value: cases:lk_1545
  //   }
  //   series cut {
  //     value: cases:Workflow
  //   }
  // }

  widget accountList {

    infobox {
      label: "Account Risk"
      info: "The Account Risk widget provides a list of accounts that fit within the filtered portfolio along with their risk calculation and scores associated with the dimensions that comprise this score. The risk calculation is a weighted index that examines the customers feelings as measured by our Empower program, behavior measured through our financial and Salesforce data, and our alignment with their feelings as measured by our VoCe program. Clicking on an account will open the Account Overview page for that specific account."
    }

    showTotals: true
    label: "Account Risk"
    table:todo //accounts:
    sortColumn: account
    sortOrder: ascending
    navigateTo: AccountOverview
    size: large

    view metric #risklevel {
      backgroundColorFormatter: riskTextBgColorFormatter
      valueColorFormatter: riskTextColorFormatter
      Size: small
    }

    view metric #riskformat {
      backgroundColorFormatter: backgroundColorFormatter
      valueColorFormatter: valueColorFormatter
      fontSize: small
    }

    view metric #adoptionlevelbehaviour {
      backgroundColorFormatter: adoptionTextBgColorFormatter
      valueColorFormatter: adoptionTextColorFormatter
      fontSize: small
    }
    column value #account {
      label: "Account"
      value:todo //accounts:Name
      rowHeader: true
      //format:long
    }

    column value #active {
      label: "Is Active"
      value:todo //accounts:ActiveClient
    }

    column value #totalAccountValue {
      label: "Total Value"
      value:todo //sum(accounts:TotalAccountValue_USD)
      format: UScurrency
      align: right
    }

    column metric #spendtrend {
      label: "Spend Trend"
      value: @index.SpendTrend
      format: spendtrend
      view: adoptionlevelbehaviour
      target: 10
      align: center
    }
    column value #revL12M {
      label: "Last 12Mth Revenue"
      value: todo //sum(opportunities:Amount_USD, @daterange.L12MonthRev)
      format: UScurrency
      align: right
    }
    column value #revP12M {
      label: "Prev 12Mth Revenue"
      value: todo //sum(opportunities:Amount_USD, @daterange.P12MonthRev)
      format: UScurrency
      align: right
    }

    column metric #risk {
      label: "Overall Risk"
      value: @calculate.riskassessment
      align: center
      format: risklevel
      view: risklevel
      target: 10
    }
    column value #behaviourlabel {
      label: "Behaviour Risk"
      value: @dimension.doing
      //view: metrics
      format: feelingrisklevel
      target: 9
      align: center
    }

    column value #cfeeling2label {
      label: "Client Feeling Risk"
      value: @dimension.clientfeelingIDX
      rowHeader: true
      align: center
      format: feelingrisklevel
    }

    column value #tfeeling2label {
      label: "Team Feeling Risk"
      value: @dimension.teamfeelingIDX
      rowHeader: true
      //format: onedecimal
      align: center
      format: feelingrisklevel
    }

    column value #noInvitesL12M {
      label: "# Invites L12M"
      value: todo //count(respondent:, (@daterange.L12MonthRelResp AND respondent:noOfEmailsSent > 0) AND respondent:smtpStatus != "NonDeliveryReport")
      rowHeader: true
      //format: onedecimal
      align: center
    }

    column value #LastInvite {
      label: "Last Invited Sent"
      value: todo //max(respondent:smtpStatusDate, respondent:noOfEmailsSent > 0 AND respondent:smtpStatus != "NonDeliveryReport")
      format: dateDefaultFormatter
      align: center
    }

    column value #LastResponse {
      label: "Last Response"
      value: todo //max(relationship:interview_start, relationship:status = "complete" OR relationship:status = "incomplete")
      format: dateDefaultFormatter
      align: center
    }

    column value #LastTeamCheck {
      label: "Last Team Check"
      value: todo //max(teamcheck:interview_start, teamcheck:status = "complete" OR teamcheck:status = "incomplete")
      format: dateDefaultFormatter
      align: center
    }
  }
}

page #AccountsinSegment {

  modal: true
  label: "Accounts in segment"

  widget accountList {

    infobox {
      label: "Account Risk"
      info: "The Account Risk widget provides a list of accounts that fit within the filtered portfolio along with their risk calculation and scores associated with the dimensions that comprise this score. The risk calculation is a weighted index that examines the customers feelings as measured by our Empower program, behavior measured through our financial and Salesforce data, and our alignment with their feelings as measured by our VoCe program. Clicking on an account will open the Account Overview page for that specific account."
    }

    showTotals: true
    label: "Account Risk"
    table:todo //accounts:
    sortColumn: account
    sortOrder: ascending
    navigateTo: AccountOverview
    size: large

    view metric #risklevel {
      backgroundColorFormatter: riskTextBgColorFormatter
      valueColorFormatter: riskTextColorFormatter
      Size: small
    }

    view metric #riskformat {
      backgroundColorFormatter: backgroundColorFormatter
      valueColorFormatter: valueColorFormatter
      fontSize: small
    }

    view metric #adoptionlevelbehaviour {
      backgroundColorFormatter: adoptionTextBgColorFormatter
      valueColorFormatter: adoptionTextColorFormatter
      fontSize: small
    }
    column value #account {
      label: "Account"
      value:todo //accounts:Name
      rowHeader: true
      //format:long
    }

    column value #active {
      label: "Is Active"
      value:todo //accounts:ActiveClient
    }

    column value #totalAccountValue {
      label: "Total Value"
      value:todo //sum(accounts:TotalAccountValue_USD)
      format: UScurrency
      align: right
    }

    column metric #spendtrend {
      label: "Spend Trend"
      value: @index.SpendTrend
      format: spendtrend
      view: adoptionlevelbehaviour
      target: 10
      align: center
    }
    column value #revL12M {
      label: "Last 12Mth Revenue"
      value: todo //sum(opportunities:Amount_USD, @daterange.L12MonthRev)
      format: UScurrency
      align: right
    }
    column value #revP12M {
      label: "Prev 12Mth Revenue"
      value: todo //sum(opportunities:Amount_USD, @daterange.P12MonthRev)
      format: UScurrency
      align: right
    }

    column metric #risk {
      label: "Overall Risk"
      value: @calculate.riskassessment
      align: center
      format: risklevel
      view: risklevel
      target: 10
    }
    column value #behaviourlabel {
      label: "Behaviour Risk"
      value: @dimension.doing
      //view: metrics
      format: feelingrisklevel
      target: 9
      align: center
    }

    column value #cfeeling2label {
      label: "Client Feeling Risk"
      value: @dimension.clientfeelingIDX
      rowHeader: true
      align: center
      format: feelingrisklevel
    }

    column value #tfeeling2label {
      label: "Team Feeling Risk"
      value: @dimension.teamfeelingIDX
      rowHeader: true
      //format: onedecimal
      align: center
      format: feelingrisklevel
    }

  }
}



page account #AccountOverview {
  label: "Account Overview"

  modal: true

  mainTable:todo //accounts:

  widget search {
    table:todo //accounts:
    layoutArea: "header"
    value:todo //accounts:Name + " - " + accounts:id
    navigateTo: "Account"
    iconType: "account"
  }

  widget title {
    table:todo //accounts:
    layout column {
      tile value #c {
        value:todo //accounts:Name
      //view: title 
      }
    }
  }

  widget summary {

    infobox {
      label: "Overall Risk Summary"
      info: "The top level summary widget provides a quick view of the current performance within the dimensions used to identify level of risk for the selected account. The Risk calculation is a weighted index that examines the customer's feelings (as measured by our Empower program), behavior (measured through our financial and Salesforce data), and our alignment with their feelings (as measured by our VoCe program)."
    }

    size: large
    table:todo //accounts:

    tile risk {
      label: "Overall Risk"
      showThermometer: false
      value: @calculate.riskassessment
      textValue:todo //IIF(@calculate.riskassessment = 0, "High", IIF(@calculate.riskassessment = 5, "Medium", IIF(@calculate.riskassessment = 10, "Safe")))
      min: 0
      max: 5
      target: 10
      renewal:todo //accounts:AccountRenewalDate
      revenue:todo //sum(opportunities:Amount_USD, @daterange.L12MonthRev)
    }

    tile metric {
      label: "Client Behaviour"
      value: @dimension.doing
      format: onedecimal
      target: 10
    }
    tile metric {
      label: "Client Feeling"
      value: @dimension.clientfeelingIDX
      target: 10
      format: onedecimal
    }

    tile metric {
      label: "Team Feeling"
      value: @dimension.teamfeelingIDX
      target: 10
      format: onedecimal
    }

    // tile casesStatus {
    //   open:todo //COUNT(cases:CaseId)
    //   overdue:todo //COUNT(cases:overdue, cases:overdue = "Yes")
    // }
  }

  widget accountList {

    infobox {
      label: "Client Behaviour"
      info: "The Client Behaviour widget provides a view of all of the operational level data used to determine the overall Client Behavior score. "
    }

    showTotals: false
    label: "Client Behaviour"
    table:todo //accounts:
    // sortColumn: accountName
    // sortOrder: ascending
    //navigateTo: ""
    size: large

    view metric #metrics {
      backgroundColorFormatter: backgroundColorFormatter
      valueColorFormatter: valueColorFormatter
      fontSize: small
      //roundCorners:true
    }

    view metric #adoptionlevelbehaviour {
      backgroundColorFormatter: adoptionTextBgColorFormatter
      valueColorFormatter: adoptionTextColorFormatter
      //size: small
    }

    column metric #licenseDiff {
      label: "User Adoption"
      value:todo //IIF((@calculate.usersAssigned - @calculate.usersLicenses) / @calculate.usersAssigned * 100 > 0, (@calculate.usersAssigned - @calculate.usersLicenses) / @calculate.usersAssigned * 100, 0)
     //format: nodecimalblank
      format: usertrend
      view: adoptionlevelbehaviour
      align: right
      target: 11
    }

    column value #licensedrva {
      label: "RVA Licenses"
      value: @calculate.usersLicenses
      format: onedecimal
      align: center
    }
    column value #assignedrva {
      label: "RVA Assigned"
      value: @calculate.usersAssigned
      format: nodecimal
      align: center
    }

    column value #activerva {
      label: "RVA Active (Curr Mth)"
      value: @calculate.currActiveUser
      format: onedecimal
      align: center
    }

    column metric #LeadScore {
      label: "Marketing Engagement"
      value: @index.LeadScore // average(LeadScore:mkto71_Lead_Score)
      format: LeadScore
      view: adoptionlevelbehaviour
      align: center
      target: 11
    }
    column value #mktgcontacts {
      label: "# Marketing Contacts"
      value:todo //COUNT(LeadScore:Id)
      format: nodecimal
      align: center
    }
    column value #responserate {
      label: "Response Rate"
      value: @calculate.responserateL12M //COUNT(relationship:responseId, relationship:status = "complete" OR relationship:status = "incomplete") * 100 / COUNT(respondent:respid, respondent:smtpstatus = "messagesent")
      format: percentage
      align: center
    }
    column value #invites {
      label: "# Invitations Sent"
      value:todo //COUNT(respondent:respid, (respondent:noOfEmailsSent > 0 AND @daterange.L12MonthRelResp) AND respondent:smtpStatus != "NonDeliveryReport")
      format: nodecimal
      target: 9
      align: center
    }
    column value #responses {
      label: "Response Count"
      format: nodecimal
      value:todo //COUNT(relationship:responseid, (relationship:status = "complete" OR relationship:status = "incomplete") AND @daterange.L12MonthRel)
      align: center
    }
    column metric #spendtrend {
      label: "Spend Trend"
      value: @index.SpendTrend
      format: spendtrend
      view: adoptionlevelbehaviour
      target: 11
      align: center
    }

    column value #revDiffPercentage {
      label: "Rev Diff (%)"
      value: todo //(sum(opportunities:Amount_USD, @daterange.L12MonthRev) - sum(opportunities:Amount_USD, @daterange.P12MonthRev)) / sum(opportunities:Amount_USD, @daterange.L12MonthRev) * 100
      format: percentageonedecimal
      align: right
    }
    column value #revDiff {
      label: "Rev Diff ($)"
      value:todo //sum(opportunities:Amount_USD, @daterange.L12MonthRev) - sum(opportunities:Amount_USD, @daterange.P12MonthRev)
      format: UScurrency
      align: center
    }

    column value #rev12Mth {
      label: "Last 12Mth Revenue"
      value:todo //sum(opportunities:Amount_USD, @daterange.L12MonthRev)
      format: UScurrency
      align: right
    }
    column value #revPrevPeriod {
      label: "Prev 12Mth Revenue"
      value:todo //sum(opportunities:Amount_USD, @daterange.P12MonthRev)
      format: UScurrency
      align: right
    }
  }

  widget metricsBeta {

    infobox {
      label: "Client Feeling"
      info: "The Client Feeling widget provides a consolidated view of the survey questions/responses from the Client Relationship and Implementation surveys that are currently being used to determine the Client Feeling score."
    }

    view metricWithBar #metric {
      backgroundColorFormatter: backgroundColorFormatter
      valueColorFormatter: valueColorFormatter
      chartColorFormatter: metricbar
      fontSize: small
      roundCorners: false
    }
    label: "Client Feeling"
    size: medium

    tile header {
      item title {
        value: ""
      }
      item title {
        value: "L12mth Score"
        align: left
      }

      item title {
        value: "Comments"
        align: left
      }
    }

    tile row #easy {
      navigateTo: DrillDown
      item value {
        value: "Likelihood To Recommend"
        rowHeader: true
      }
      item metric {
        value:todo //average(score(relationship:Q1), @daterange.L12MonthRel)
        target: 9
        view: metric
      }
      item value {
        value:todo //COUNT(relationship:Q1, @daterange.L12MonthRel)
        align: right
      }
    }

    tile row #metneeds {
      item value {
        value: "Support Business Needs"
        rowHeader: true
      }
      item metric {
        value:todo //average(score(relationship:Q12), @daterange.L12MonthRel)
        target: 9
        view: metric
      }
      item value {
        value:todo //COUNT(relationship:Q12, @daterange.L12MonthRel)
        align: right
      }
    }

    tile row #addedValue {
      item value {
        value: "Added Value"
        rowHeader: true
      }
      item metric {
        value:todo //average(score(relationship:Q3), @daterange.L12MonthRel)
        target: 9
        view: metric
      }
      item value {
        value:todo //COUNT(relationship:Q3, @daterange.L12MonthRel)
        align: right
      }
    }
    tile row #relationshipsat {
      item value {
        value: "Relationship Satisfaction"
        rowHeader: true
      }
      item metric {
        value:todo //average(score(relationship:Q4), @daterange.L12MonthRel)
        target: 9
        view: metric
      }
      item value {
        value:todo //COUNT(relationship:Q4, @daterange.L12MonthRel)
        align: right
      }
    }
    tile row #productsat {
      item value {
        value: "Technology Satisfaction"
        rowHeader: true
      }
      item metric {
        value:todo //average(score(relationship:Q7), @daterange.L12MonthRel)
        target: 9
        view: metric
      }
      item value {
        value:todo //COUNT(relationship:Q7, @daterange.L12MonthRel)
        align: right
      }
    }
  }

  widget metricsBeta {

    infobox {
      label: "Team Feeling"
      info: "The Team Feeling widget provides a consolidated view of the survey questions/responses from the internal Health Check and Implementation surveys used to determine the Team Feeling score."
    }

    view metricWithBar #metric {
      backgroundColorFormatter: backgroundColorFormatter
      valueColorFormatter: valueColorFormatter
      chartColorFormatter: metricbar
      fontSize: small
      roundCorners: false
    }
    label: "Team Feeling"
    size: medium

    tile header {
      item title {
        value: ""
      }
      item title {
        value: "L12mth Score"
        align: left
      }
      item title {
        value: "Comments"
        align: left
      }
    }

    tile row #nps {
      item value {
        value: "Likelihood To Recommend"
        rowHeader: true
      }
      item metric {
        value:todo //average(score(teamcheck:Q1), @daterange.L12MonthTC)
        target: 9
        view: metric
      }
      item value {
        value:todo //COUNT(teamcheck:Q1, @daterange.L12MonthTC)
        align: right
      }
    }

    tile row #loyalty {
      item value {
        value: "Likelihood To Renew"
        rowHeader: true
      }
      item metric {
        value:todo //average(score(teamcheck:Q2), @daterange.L12MonthTC)
        target: 9
        view: metric
      }
      item value {
        value:todo //COUNT(teamcheck:Q2, @daterange.L12MonthTC)
        align: right
      }
    }

    tile row #benefits {
      item value {
        value: "Recognises benefits of Confirmit across business"
        rowHeader: true
      }
      item metric {
        value:todo //average(score(teamcheck:Q8), @daterange.L12MonthTC)
        target: 9
        view: metric
      }
      item value {
        value:todo //COUNT(teamcheck:Q8, @daterange.L12MonthTC)
        align: right
      }
    }
    tile row #experience {
      item value {
        value: "Experience of Confirmit support offered"
        rowHeader: true
      }
      item metric {
        value:todo //average(score(teamcheck:Q9), @daterange.L12MonthTC)
        target: 9
        view: metric
      }
      item value {
        value:todo //COUNT(teamcheck:Q9, @daterange.L12MonthTC)
        align: right
      }
    }
  }


  widget contactList {

    infobox {
      label: "Contacts"
      info: "The Contacts widget provides a list of all contacts currently associated with this account within Salesforce."
    }

    label: "Contacts"
    table: contacts:
    size: large
    navigateTo: ContactOverview

    column value #name {
      label: "Name"
      value: contacts:FirstName + " " + contacts:LastName
    }
    column value #role {
      label: "Role"
      value: contacts:ContactRole
    }
    column value #country {
      label: "Country"
      value: contacts:MailingCountry
    }

    column date #lastInvited {
      label: "Last Invite Date"
      value:todo //max(respondent:smtpStatusDate)
      align: center
    }
    column value #nps {
      label: "NPS Group"
      value:todo //IIF(max(score(relationship:Q1), relationship:interview_start = max(relationship:interview_start)) > 0, max(score(relationship:Q1), relationship:interview_start = max(relationship:interview_start)), -1)
      align: center
      format:todo //NPSgroupsContacts
    }

    column date #lastResponse {
      label: "Last Feedback Date"
      value:todo //max(relationship:interview_start)
      align: center
    }
    column value #comments {
      label: "Recent Comment"
      value:todo //max(relationship:Q2, relationship:interview_start = max(relationship:interview_start))
      //format: commentFormat
    }

    // column value noCases {
    //   label: "Total Cases"
    //   value:todo //COUNT(cases:CaseId)
    //   align: center
    // }

    // column value overdueCases {
    //   label: "Overdue Cases"
    //   value:todo //COUNT(cases:CaseId, cases:Overdue = "Yes")
    //   align: center
    // }

  }

}

page contact #ContactOverview {
  label: "Contact Overview"

  modal: true

  widget title {
    table: contacts:
    view icon #icon {
      size: "60"
      roundedCorner: true
    }

    layout column {
      tile value #logo {
        value: "/isa/BDJPFRDMEYBPBKLVADAYFQCDAVIOEQJR/magdalenas/defaultLogo.PNG"//"http://is1.mzstatic.com/image/thumb/Purple71/v4/89/51/f4/8951f4f1-fd6b-fa59-38b2-191140473b9a/source/175x175bb.jpg"
        view: icon
      }
    }
    layout column {
      layout row {
        tile value #firstName {
          value: contacts:FirstName
        }
        tile value #lastName {
          value: contacts:LastName
        }
        tile role {
          value: contacts:ContactRole
        }
      }
      layout row {
        tile company {
          value:todo //accounts:Name
          navigateTo: AccountOverview
        }
      }
    }
  }

  widget summary {

    infobox {
      label: "Contact Summary"
      info: "The Contact Summary widget provides a window into some of the information captured for this contact within Salesforce, along with some key metrics associated with the overall risk calculation for the account (likelihood to renew, response rate). The email link is live, and allows you to email the contact directly from this screen."
    }

    size: large
    table: contacts:
    tile contactDetails #cc {
      title: contacts:Title
      role: contacts:ContactRole
      email: contacts:email
      phone: contacts:Phone
      industry: contacts:Industry
    }

    tile accountDetails #cc4 {
      accountOwner:todo //accounts:AccountOwnerName
      salesManager: contacts:SalesLeader1
      region: contacts:WorldRegion
      revenue:todo //accounts:AnnualAccountValue_USD // Values in Accounts table is inaccurate (based on 2016 value)
      renewalDate:todo //accounts:AccountRenewalDate

    }

    tile metric #a {
      label: "LTR"
      value:todo //average(score(relationship:Q1))
      target: 9
    }

    tile responseRate {
      label: "Response Status"
      invites:todo //COUNT(respondent:respid, respondent:smtpstatus = "messagesent")
      responses:todo //COUNT(relationship:responseId, relationship:status = "complete" OR relationship:status = "incomplete")
    }

    // tile casesStatus {
    //   label: Cases
    //   open:todo //COUNT(cases:CaseId)
    //   overdue: 0
    // }
  }

  widget contactSurveys {

    infobox {
      label: "Feedback History"
      info: "The Feedback History widget lists all feedback responses captured for this contact from {what time frame?}. This is valuable in understanding how/if a specific contact's perception has shifted over time. The blue "
      Resend #linkprovidestheAccountManagerwiththeabilitytoresendasurveyiftheoriginalsurveywasntreceivedbythecustomerorifanadditionalreminderisrequired
    }

    label: "Feedback History"
    table: respondent:
    sortColumn: surveyDate
    sortOrder: descending
    size: medium
    navigateTo: Response

    view metric #metrics {
      backgroundColorFormatter: backgroundColorFormatter
      valueColorFormatter: valueColorFormatter
      fontSize: small
    }

    column date #inviteDate {
      label: "Request Date"
      value: respondent:smtpstatusDate
      format: dateDefaultFormatter
    }
    column date #surveyDate {
      label: "Response Date"
      value: relationship:interview_start
      format: dateDefaultFormatter
    }

    column value #survey {
      label: "Survey"
      value: "Relationship"
    }
    column value #status {
      label: "Status"
      value: respondent:responseStatus
    }

    column link #Resend {
      label: "Resend"
      value:todo //IIF(relationship:status = "Complete", "", "Resend")
      link surveyBlock #myLink {
        survey: p1850259384
        blockId: "Resend Invite"
        respid: relationship:respid
      }
    }

    column metric #ltr {
      label: "LTR"
      value:todo //average(score(relationship:Q1))
      view: metrics
      target: 9
      align: center
    }

    column value #comments {
      label: "Comments"
      value: relationship:Q2
    }

  }

//  widget accountCases {

    // infobox {
    //   label: "Case History"
    //   info: "The Case History widget provides a list of all cases opened as a result of direct feedback from this contact from {what time frame?}"
    // }

    // label: "Case History"
    // table: cases:
    // size: medium
    // sortColumn: dateCreated
    // sortOrder: descending

    // view link link1 {
    //   label: "View case"
    // }

    // column value dateCreated {
    //   label: "Created"
    //   value: cases:DateCreated
    //   format: long
    //   align: center
    // }
    // column value dateDue {
    //   label: "Due"
    //   value: cases:DateDue
    //   format: long
    //   align: center
    // }

    // column value caseStatus {
    //   label: "Status"
    //   value: cases:lk_1545
    // }
    // column value issuetype {
    //   label: "Issues Identified"
    //   value: cases:lk_1547
    // }
    // column value link {
    //   label: "Action"
    //   value: cases:CaseLink
    //   view: link1
    // }
 // }

}

page #CustomerAlerts {
  label: "Customer Alerts"

  //modal: true

  filter expression {
    value:todo //accounts:ActiveClient = "True"
    filtertype: "preAggregate"
  }

  // widget barChart {

  //   infobox {
  //     label: "Issues Triggering Customer Alerts"
  //     info: "The Issues Triggering Customer Alerts widget highlights the status of all negative alerts stemming from the Relationship Survey and the Implementation survey from the last 12 months."
  //   }
  //   table: cases:
  //   label: "Issues Triggering Customer Alerts"
  //   size: large
  //   value:todo //COUNT(cases:caseId)
  //   palette: "#0F5E7D","#FFBB5C","#CF2740","#ED4F34","#CCCCCC","#333333","#F58533"
  //   navigateTo: "Cases"
  //   category cut {
  //     value: cases:lk_1547
  //     removeEmpty: true
  //   }
  //   series cut {
  //     value: cases:lk_1545
  //   }
  // }

  // widget accountCases {

  //   infobox {
  //     label: "Cases"
  //     info: "The Cases widget provides a list of all cases from the Relationship survey and the Implementation survey, along with current status. Click on the blue ''View case' link to view the fully recorded details regarding that particular case."
  //   }

  //   label: "Cases"
  //   table: cases:
  //   size: large
  //   sortColumn: dateCreated
  //   sortOrder: descending

  //   view link link1 {
  //     label: "View case"
  //   }

  //   column value accountName {
  //     label: "Account"
  //     value:todo //accounts:Name
  //   }

  //   column value Contact {
  //     label: "Contact"
  //     value: contacts:FirstName + " " + contacts:LastName
  //   }

  //   column value dateCreated {
  //     label: "Created"
  //     value: cases:DateCreated
  //     format: long
  //     align: center
  //   }
  //   column value dateDue {
  //     label: "Due"
  //     value: cases:DateDue
  //     format: long
  //     align: center
  //   }
  //   column value workflow {
  //     label: "Workflow"
  //     value: cases:Workflow
  //   }
  //   column value caseStatus {
  //     label: "Status"
  //     value: cases:lk_1545
  //   }
  //   column value issuetype {
  //     label: "Issues Identified"
  //     value: cases:lk_1547
  //   }
  //   column value link {
  //     label: "Action"
  //     value: cases:CaseLink
  //     view: link1
  //   }
  // }

}

page #ResponseManagement {
  label: "Response Management"


  filter expression {
    value:todo //IIF((respondent:smtpstatus != "NonDeliveryReport" AND respondent:noOfEmailsSent > 0) AND relationship:status != "Complete", true, false)
    //  filtertype: "preAggregate"
  }

  widget accountList {


    infobox {
      label: "Silent Accounts"
      info: "The Silent Accounts widget provides a list of accounts for whom surveys have been sent, with no reply. The lack of response/engagement could be an indicator of risk. Account Managers should pay close attention to any customers who are not providing at least one response to the Empower relationship survey during the year."
    }

    label: "Silent Accounts"
    size: large
    table:todo //accounts:
    sortColumn: account
    sortOrder: ascending
    navigateTo: NonResponders

    column value #account {
      label: "Account"
      value:todo //accounts:Name
    }
    column value #invites {
      label: "# of Invites"
      value:todo //COUNT(respondent:respid)
    }
    column value #responses {
      label: "# of Responses"
      value:todo //COUNT(relationship:responseId)
    }

    column value #LastInvite {
      label: "Last Invited Sent"
      value:todo //max(respondent:smtpStatusDate, respondent:noOfEmailsSent > 0 AND respondent:smtpStatus != "NonDeliveryReport")
      format: dateDefaultFormatter
      align: center
    }

    column value #LastResponse {
      label: "Last Response"
      value:todo //max(relationship:interview_start, relationship:status = "complete" OR relationship:status = "incomplete")
      format: dateDefaultFormatter
      align: center
    }

    column value #LastTeamCheck {
      label: "Last Team Check"
      value:todo //max(teamcheck:interview_start, teamcheck:status = "complete" OR teamcheck:status = "incomplete")
      format: dateDefaultFormatter
      align: center
    }

  }
}

page #NonResponders {
  label: "Non Responders"

  //modal: true

  filter expression {
    value:todo //IIF((respondent:smtpstatus != "NonDeliveryReport" AND respondent:noOfEmailsSent > 0) AND relationship:status != "Complete", true, false)
    //  filtertype: "preAggregate"
  }
  widget contactSurveys {

    infobox {
      label: "Silent Accounts: Invite History"
      info: "NA"
    }


    label: "Silent Accounts: Invite History"
    table: respondent:
    navigateTo: Response
    sortColumn: inviteDate
    sortOrder: descending
    size: large

    view metric #metrics {
      backgroundColorFormatter: backgroundColorFormatter
      valueColorFormatter: valueColorFormatter
      fontSize: small
      //roundCorners:true
    }
    column value #name {
      label: "Contact"
      value: contacts:FirstName + " " + contacts:LastName
    }
    column value #account {
      label: "Account"
      value:todo //accounts:Name
    }
    column value #role {
      label: "Role"
      value: contacts:ContactRole
    }
    column date #inviteDate {
      label: "Invite Date"
      value: respondent:smtpstatusDate
      format: dateDefaultFormatter
    }
    column value #status {
      label: "Response Status"
      value: relationship:status
    }
    column link #Resend {
      label: "Resend invite"
      value:todo //IIF(relationship:status = "Complete", "", "Resend")
      link surveyBlock #myLink {
        survey: p1850259384
        blockId: "Resend Invite"
        respid: respondent:respid
      }
    }
    column date #surveyDate {
      label: "Response Date"
      value: relationship:interview_start
      format: dateDefaultFormatter
    }
  }
}

page #BusinessOverview {
  label: "Business Overview"


  widget kpi {

    infobox {
      label: "Net Sales Performance"
      info: "The Net Sales Performance widget is a quick view of current performance against our net sales metric target for last completed financial quarter. The black line within the arc represents the target. If the color is green the metric is at or above the acceptable range of the target score. If the color is yellow, the metric is within an x% margin lower than target. If the target is red, the current metric is outside of an acceptable range below the target and requires attention."
    }

    filter expression {
      value: todo //InMonth(finance:Month, -12, -1)
    }

    label: "Net Sales Performance"
    size: small
    tile kpi {
      label: "Quota Achievement"
      value: @calculate.salesperformance
      target: 100
      min: 0
      max: 100
      format: percentage
      targetFormat: percentage
      gaugeColorFormat: NetSalesGauge
      tile value {
        label: "New Clients"
        value: finance:Noofnewclients
    //format: nodecimal
      }
    }
  }

  // widget barChart {

  //   infobox {
  //     label: "Net Sales Performance"
  //     info: "The Net Sales Performance widget represents quarterly net sales figures as a percentage of expected quota for the prior 12 months."
  //   }

  //   label: "Net Sales Performance"
  //   size: medium
  //   value: @calculate.salesperformance
  //   format: percentageonedecimal
  //   //dateFormat: quarterlabel // NEED THIS TO BE FIXED >> UNSURE HOW
  //   palette: "#0F5E7D","#FFBB5C","#CF2740","#ED4F34","#CCCCCC","#333333","#F58533"
  //   removeEmpty: true
  //   category cut {
  //     value: CalendarQuarter(finance:month)
  //     //dateFormat: quarterlabel        
  //     removeEmpty: true
  //   }
  //   // cateogry cut {

  //   //   value: finance:RevenueRenewalRate * 100

  //   // }
  // }

  widget chart {

    infobox {
      label: "Net Sales Performance vs Renewal Rate"
      info: "The Net Sales Performance widget represents quarterly net sales figures as a percentage of expected quota for the prior 12 months."
    }

    filter expression {
      value: @daterange.currentPeriodFin
    }

    label: "Net Sales Performance vs Renewal Rate"
    palette: "#2B3E50","#DF691A","#54bc23"

    size: medium
    legend: bottomCenter
    gridLines: none

    chart line {
      //lineType: basis
      dotSize: 5
    }
    removeEmptyCategories: true

    series #ss1 {
      value: @calculate.salesperformance
      format: percentageonedecimal
      label: "Net Sales Performance"
    }
    series #ss2 {
      value:todo //sum(finance:RevenueRenewalRate) * 100
      format: percentageonedecimal
      label: "Renewal Rate"
    }


    series #ss3 {
      value: 100
      format: valueDefaultFormatter
      label: "target"
      chart line {
        lineType: linear
        dotSize: 0
      }
    }

    category date {
      value: finance:month
      breakdownBy: calendarQuarter
      label: "Date"
      start: "-12 months" // THIS MEEDS TO BE DYNAMIC
      end: "0 days"
      format: quarterlabel
    }

  }


  widget kpi {

    infobox {
      label: "Renewal Rate"
      info: "The Renewal Rate widget is a quick view of the current response rate for the Empower relationship survey for last completed financial quarter. The black line within the arc represents the target. If the color is green the metric is at or above the acceptable range of the target score. If the color is amber, the metric is within an x% margin lower than target. If the target is red, the current metric is outside of an acceptable range below the target and requires attention."
    }

    filter expression {
      value: todo //InQuarter(finance:Month, -1, -1)
    }
    label: "Renewal Rate"
    size: small
    tile kpi {
      label: "Renewal Achievement"
      value: finance:RevenueRenewalRate * 100
      target: 95
      min: 0
      max: 100
      format: percentage
      targetFormat: percentage
      gaugeColorFormat: RenewalRateGauge

    }
  }

  widget kpi {
    infobox {
      label: "Client NPS"
      info: "The Client NPS widget is a quick view of the current NPS scores coming through the Empower relationship survey for {what time frame?}. The black line within the arc represents the target. If the color is green the metric is at or above the acceptable range of the target score. If the color is yellow, the metric is within an x% margin lower than target. If the target is red, the current metric is outside of an acceptable range below the target and requires attention."
    }

    label: "Client NPS"
    size: small
    tile kpi {
      label: "NPS"
      value:todo //NPS(relationship:Q1, @daterange.currentPeriodRel) * 100
      format: onedecimal
      min: -100
      max: 100
      target: 20
      targetFormat: onedecimal
      gaugeColorFormat:todo //NPSGauge
      tile value {
        label: "Responses"
        value:todo //COUNT(relationship:responseid, (relationship:status = "Complete" OR relationship:status = "incomplete") AND @daterange.currentPeriodRel)
      }
      tile value {
        label: "Yearly change"
        value:todo //NPS(relationship:Q1, @daterange.L12MonthRel) * 100 - NPS(relationship:Q1, @daterange.P12MonthRel) * 100
        format: onedecimal
      }
    }
  }

  widget chart {
    infobox {
      label: "NPS Performance"
      info: "The NPS Performance widget provides a month by month comparison of NPS scores between the external customer relationship survey and the internal health check survey over the past 12 months. Actual scores for each month can be seen by hovering over the data points on the chart."
    }

    filter expression {
      value: @daterange.currentPeriodTRCom
    }
    //animation: true
    label: "NPS Performance"
    palette: "#2B3E50","#DF691A","#54bc23"
    size: medium
    legend: bottomCenter
    gridLines: none
    removeEmptyCategories: true

    chart line {
      //lineType: basis
      dotSize: 5
    }

    series #ss1 {
      value:todo //NPS(clientandteam:Q1, clientandteam:combined_sourceid = "p2065982") * 100
      format: onedecimal
      label: "Client NPS"
    }
    series #ss2 {
      value:todo //NPS(clientandteam:Q1, clientandteam:combined_sourceid = "p2067368") * 100
      format: onedecimal
      label: "Internal Team NPS"
    }
    series #ss3 {
      value: 20
      format: valueDefaultFormatter
      label: "target"
      chart line {
        lineType: linear
        dotSize: 0
      }
    }

    category overlappingDate {
      value: clientandteam:RelationshipSurveyDate
      breakdownBy: calendarMonth
      start: "-12 months" // THIS MEEDS TO BE DYNAMIC
      end: "0 days"
      startShift: "-12 month"
      endShift: "0 month"
    }
  }


  widget kpi {

    infobox {
      label: "Internal Team NPS"
      info: "The Internal Team NPS widget is a quick view of the current NPS score as represented in Health Check surveys completed by the Account Managers for {what time frame?}. The black line within the arc represents the target. If the color is green the metric is at or above the acceptable range of the target score. If the color is yellow, the metric is within an x% margin lower than target. If the target is red, the current metric is outside of an acceptable range below the target and requires attention."
    }

    label: "Internal Team NPS"
    size: small
    tile kpi {
      label: "NPS"
      value:todo //NPS(teamcheck:Q1, @daterange.currentPeriodTC) * 100
      format: onedecimal
      min: -100
      max: 100
      target: 20
      targetFormat: onedecimal
      gaugeColorFormat:todo //NPSGauge
      tile value {
        label: "Responses"
        value:todo //COUNT(teamcheck:responseid, (teamcheck:status = "Complete" OR teamcheck:status = "incomplete") AND @daterange.currentPeriodTC)
      }
      tile value {
        label: "Yearly change"
        value:todo //NPS(teamcheck:Q1, @daterange.L12MonthTC) * 100 - NPS(teamcheck:Q1, @daterange.P12MonthTC) * 100
        format: onedecimal
      }
    }
  }


  widget accountList {

    infobox {
      label: "How Are We Performing Across Regions"
      info: "The 'How Are We Performing Across Regions' widget represents current NPS scores {for what time period?} rolled up to the region level, with the ability to drill down through the regional account management hierarchy down to the account level."
    }

    label: "How Are We Performing Across Regions"
    table: hierarchy:
    hierarchy: hierarchy:660
    ////hierarchy: hierarchy:21039
    size: large
    column hierarchy {
      label: "Region"
      value: hierarchy:language_text
      removeEmpty: true
    }
    column metric {
      label: "Client NPS"
      value:todo //NPS(relationship:Q1, @daterange.currentPeriodRel) * 100
      format: onedecimal
    }
    column metric {
      label: "Yearly change"
      value:todo //NPS(relationship:Q1, @daterange.currentPeriodRel) * 100 - NPS(relationship:Q1, @daterange.previousPeriodRel) * 100
      format: onedecimal
    }

    column metric {
      label: "Internal Team NPS"
      value:todo //NPS(teamcheck:Q1, @daterange.currentPeriodTC) * 100
      format: onedecimal
    }

    column metric {
      label: "Yearly change"
      value:todo //NPS(teamcheck:Q1, @daterange.currentPeriodTC) * 100 - NPS(teamcheck:Q1, @daterange.previousPeriodTC) * 100
      format: onedecimal
    }
  }

  widget markdown {
    size: large
    markdown: "Key metrics across the customer journey will be rolled into Empower in phases. Metrics listed below without data are scheduled for phases 2/3."
  }
  widget metricsBeta {

    infobox {
      label: "Research"
      info: "The Research widget highlights key metrics that inform on performance with our customers and prospects as they are researching and evaluating our offerings. *Does marketing have text describing their engagement score and the "
      Easy Score #thatwecouldincludeMetricsingreenareinlinewithgoalsMetricsinyellowareoutsidetherangeofbeingacceptableandshouldbemonitoredbutnoactionisrequiredMetricsinredareoutofrangeoftheexpectedgoalandshouldbeaddressed
    }

    view metricWithBar #metric {
      valueColorFormatter: acrossTheJourney
      showThermometer: false
    }

    view metricWithBar #metriccell {
      backgroundColorFormatter: backgroundColorFormatter
      valueColorFormatter: valueColorFormatter
      showThermometer: false
      fontSize: small
      roundCorners: false
    }

    label: "Research"
    size: small
    tile header {
      item title {
        value: "KPI"
        rowHeader: true
      }
      item title {
        value: "Average"
        rowHeader: true
      }
    }
    tile row {
      item value {
        value: "Marketing Engagement"
      }
      item metric {
        value: @index.LeadScore //average(LeadScore:mkto71_Lead_Score)
        view: metriccell
        target: 100
        format: LeadScore
      }
    }
    tile row {
      item value {
        value: "Confirmit.com Easy Score"
      }
      item metric {
        value:todo //average(score(website:Q2.1))
        target: 8
        view: metriccell
      }
    }

    tile row {
      item value {
        value: "Funnel Progress"
      }
      item metric {
        value: ""
        view: metric
        target: 7
      }
    }
  }

  widget metricsBeta {

    infobox {
      label: "Decide"
      info: "The Decide widget highlights key metrics that inform on performance with our customers and prospects as they make their decision to proceed with, or decline to move forward with, our offerings. *Is there anything we can add regarding expected targets for SQL (and the other metrics)? Along with a short blurb about what is intended with this metric?  Metrics in green are in line with goals. Metrics in yellow are outside the range of being acceptable and should be monitored, but no action is required. Metrics in red are out of range of the expected goal and should be addressed."
    }

    view metricWithBar #metric {
      valueColorFormatter: acrossTheJourney
      showThermometer: false
    }

    view metricWithBar #metriccell {
      backgroundColorFormatter: backgroundColorFormatter
      valueColorFormatter: valueColorFormatter
      showThermometer: false
      fontSize: small
      roundCorners: false
    }

    label: "Decide"
    size: small
    tile header {
      item title {
        value: "KPI"
        rowHeader: true
      }
      item title {
        value: "Average"
        rowHeader: true
      }
    }
    tile row {
      item value {
        value: "Conversion Rate"
      }
      item metric {
        value: ""
        target: 100
        view: metric
      }
    }
    tile row {
      item value {
        value: "SQL Quota Achieved"
      }
      item metric {
        value: finance:SQLquotaachievement * 100
        view: metriccell
        target: 100
        format: percentage
      }
    }
    tile row {
      item value {
        value: "Revenue to Target"
      }
      item metric {
        value: ""
        view: metric
        target: 100
      }
    }
    tile row {
      item value {
        value: "Win/Loss Completion"
      }
      item metric {
        value: "" //average(score(relationship:Q9.1))
        view: metric
        target: 7
      }
    }
    tile row {
      item value {
        value: "New Accounts"
      }
      item metric {
        value: finance:Noofnewclients
        view: metriccell
        target: 7
      }
    }
  }

  widget metricsBeta {

    infobox {
      label: "Use"
      info: "The Use widget highlights key metrics that inform on performance with our customers and prospects as they are using our product and engaged with the teams that provide them with service. *How are we deriving user adoption? Is it based on usage somehow? The other 4 metrics are based on results from the implementation surveys provided to customers following an initial implementation or subsequent project. Metrics in green are in line with goals. Metrics in yellow are outside the range of being acceptable and should be monitored, but no action is required. Metrics in red are out of range of the expected goal and should be addressed."
    }

    view metricWithBar #metric {
      valueColorFormatter: acrossTheJourney
      showThermometer: false
    }
    view metricWithBar #metriccell {
      backgroundColorFormatter: backgroundColorFormatter
      valueColorFormatter: valueColorFormatter
      showThermometer: false
      fontSize: small
    }
    label: "Use"
    size: small
    tile header {
      item title {
        value: "KPI"
        rowHeader: true
      }
      item title {
        value: "Average"
        rowHeader: true
      }
    }
    tile row {
      item value {
        value: "User Adoption"
      }
      item metric {
        value: @index.UserAdoption
        view: metriccell
        target: 100
        format: adoptionrate
      }
    }

    // CANNOT DO THIS BECAUSE WE CANNOT ADD IMPLEMENTATION SOURCES.
    tile row {
      item value {
        value: "Implementation Met Needs"
      }
      item metric {
        value: ""//average(score(implementClient:C_Met_Needs.1))
        target: 8
        view: metric
      }
    }
    tile row {
      item value {
        value: "Relationship Satisfaction"
      }
      item metric {
        value:todo //average(score(relationship:Q4), @daterange.currentPeriodRel)
        view: metriccell
        target: 8
      }
    }
    tile row {
      item value {
        value: "Technology Satisfaction"
      }
      item metric {
        value:todo //average(score(relationship:Q7), @daterange.currentPeriodRel)
        view: metriccell
        target: 7
      }
    }
    tile row {
      item value {
        value: "Support Satisfaction"
      }
      item metric {
        value: ""
        view: metric
        target: 7
      }
    }
  }

  widget metricsBeta {

    infobox {
      label: "Renew"
      info: "The Renew widget highlights key metrics that inform on performance with our customers and prospects as they are considering whether or not to continue doing business with Confirmit. *Are renewal rate and growth rate YTD? Past 12 months? The likelihood to renew and supports needs metrics are derived from the current Empower relationship survey for {what time frame?}. Metrics in green are in line with goals. Metrics in yellow are outside the range of being acceptable and should be monitored, but no action is required. Metrics in red are out of range of the expected goal and should be addressed."
    }

    view metricWithBar #metric {
      valueColorFormatter: acrossTheJourney
      showThermometer: false
    }
    view metricWithBar #metriccell {
      backgroundColorFormatter: backgroundColorFormatter
      valueColorFormatter: valueColorFormatter
      showThermometer: false
      fontSize: small
    }
    label: "Renew"
    size: small
    tile header {
      item title {
        value: "KPI"
        rowHeader: true
      }
      item title {
        value: "Average"
        rowHeader: true
      }
    }
    tile row {
      item value {
        value: "Renewal Rate"
      }
      item metric {
        value: finance:RevenueRenewalRate * 100
        target: 100
        view: metric
        format: percentage
      }
    }
    tile row {
      item value {
        value: "Growth Rate"
      }
      item metric {
        value: @index.SpendTrend
        target: 100
        view: metriccell
        format: spendtrend
      }
    }
    tile row {
      item value {
        value: "Likelihood To Renew"
      }
      item metric {
        value:todo //average(score(teamcheck:Q2), @daterange.currentPeriodTC)
        view: metriccell
        target: 8
      }
    }
    tile row {
      item value {
        value: "Confident Support Future Needs"
      }
      item metric {
        value:todo //average(score(relationship:Q12), @daterange.currentPeriodTC)
        view: metriccell
        target: 7
      }
    }

  }

}

page #InitiativeDetails {
  label: "InitiativeDetails"

  hide: true
  widget initiativeDetailSummary {
    size: "large"
  }

  widget initiativeTrend {
    size: "large"
  }

  widget initiativeActions {
    size: "halfwidth"
  }

  widget initiativeNotes {
    size: "halfwidth"
  }

}

page #WeightModelTest {
  label: "Weight Model Test"


  widget markdown {
    size: large
    markdown: "WIP: Using this page to design and validate risk and weight model calculations"
  }
  widget accountList {

    showTotals: false
    label: "Client Feeling Weight Model"
    table: weight:
    //sortColumn: MID
    //sortOrder: descending
    size: small

    column value #element {
      label: "Element"
      value: weight:ELEMENT
      rowHeader: true
      //format:long
    }
    column value #eweight {
      label: "Weight"
      value: weight:ELEMENTWEIGHT
      rowHeader: true
      align: center
      format: twodecimal
    }
  }

  widget kpi {
    label: "Client Feeling Avg Score"
    size: small
    tile kpi {
      label: "Weighted Avg"
      value: @dimension.clientfeeling
      target: 10
      min: 0
      max: 10
      format: onedecimal
      targetFormat: nodecimal
      gaugeColorFormat: metriccellcolor
      tile value {
        label: "Calculated from average composite score"
        value: ""
      }
    }
  }
  widget kpi {
    label: "Client Feeling Index Score"
    size: small
    tile kpi {
      label: "Weighted Index"
      value: @dimension.clientfeelingIDX
      min: 0
      max: 10
      target: 10
      format: onedecimal
      targetFormat: nodecimal
      gaugeColorFormat: metriccellcolor
      tile value {
        label: "Calculated from index score"
        value: ""
      }
    }
  }

  widget markdown {
    size: small
    markdown: "Placeholder for some info/text (but really because I just want to break to another line. :/)"
  }

  widget accountList {
    filter expression {
      value: weight:FOCUS = "Employee"
      filtertype: "postAggregate"
    }
    showTotals: false
    label: "Team Feeling Weight Model"
    table: weight:
    //sortColumn: MID
    //sortOrder: descending
    size: small

    column value #element {
      label: "Element"
      value: weight:ELEMENT
      rowHeader: true
      //format:long
    }
    column value #eweight {
      label: "Weight"
      value: weight:ELEMENTWEIGHT
      rowHeader: true
      align: center
      format: twodecimal
    }
  }
  widget kpi {
    label: "Team Feeling Avg Score"
    size: small
    tile kpi {
      label: "Weighted Avg"
      value: @dimension.teamfeeling
      target: 10
      min: 0
      max: 10
      format: onedecimal
      targetFormat: nodecimal
      gaugeColorFormat: metriccellcolor
      tile value {
        label: "Calculated from average composite score"
        value: ""
      }
    }
  }
  widget kpi {
    label: "Team Feeling Index Score"
    size: small
    tile kpi {
      label: "Index Score"
      value: @dimension.teamfeelingIDX
      target: 10
      min: 0
      max: 10
      format: onedecimal
      targetFormat: nodecimal
      gaugeColorFormat: metriccellcolor
      tile value {
        label: "Calculated from index score"
        value: ""
      }
    }
  }
  widget markdown {
    size: small
    markdown: "Placeholder for some info/text (but really because I just want to break to another line. :/)"
  }

  widget accountList {
    filter expression {
      value: weight:DIMENSION = "Doing"
      filtertype: "postAggregate"
    }
    showTotals: false
    label: "Client Doing Weight Model"
    table: weight:
    //sortColumn: MID
    //sortOrder: descending
    size: small

    column value #element {
      label: "Element"
      value: weight:ELEMENT
      rowHeader: true
      //format:long
    }
    column value #eweight {
      label: "Weight"
      value: weight:ELEMENTWEIGHT
      rowHeader: true
      align: center
      format: twodecimal
    }
  }



  widget markdown {
    size: small
    markdown: "Placeholder for some info/text (but really because I just want to break to another line. :/)"
  }

  widget markdown {
    size: large
    markdown: "WIP: Pending validation - Mark Ratekin to provide 12month rolling validation file. Will apply date range filter to compare apples to apples."
  }
  widget accountList {
    filter expression {
      value: @daterange.L12MonthRel
      filtertype: "postAggregate"
    }
    showTotals: true
    label: "Client Feeling Validation"
    table:todo //accounts:
    sortColumn: account
    sortOrder: ascending
    navigateTo: AccountOverview
    size: large

    column value #account {
      label: "Account"
      value:todo //accounts:Name
      rowHeader: true
      //format:long
    }
    column value #responsecount {
      label: "Responses"
      value:todo //COUNT(relationship:responseid)
      rowHeader: true
      align: center
    }
    column value #cfeelinglabel {
      label: "Client Feeling Risk"
      value: @dimension.clientfeeling
      rowHeader: true
      format: feelingrisklevel
      align: center
    }
    column metric #cfeeling {
      label: "Client Feeling Avg"
      value: @dimension.clientfeeling
      rowHeader: true
      format: onedecimal
      align: center
    }
    column value #nps {
      label: "NPS"
      value:todo //average(score(relationship:Q1))
      rowHeader: true
      format: onedecimal
      align: center
    }
    column value #needs {
      label: "Needs"
      value:todo //average(score(relationship:Q12))
      rowHeader: true
      format: onedecimal
      align: center
    }
    column value #value {
      label: "Value"
      value:todo //average(score(relationship:Q3))
      rowHeader: true
      format: onedecimal
      align: center
    }
    column value #rel {
      label: "Relationship"
      value:todo //average(score(relationship:Q4))
      rowHeader: true
      format: onedecimal
      align: center
    }
    column value #tech {
      label: "Tech"
      value:todo //average(score(relationship:Q7))
      rowHeader: true
      format: onedecimal
      align: center
    }
//INDEXED SCORE VALIDATION ROWS
    column value #cfeeling2label {
      label: "Client Feeling Index Risk"
      value: @dimension.clientfeelingIDX
      rowHeader: true
      //format: onedecimal
      align: center
      format: feelingrisklevel
    }
    column metric #cfeeling2 {
      label: "Client Feeling Index"
      value: @dimension.clientfeelingIDX
      rowHeader: true
      //format: onedecimal
      align: center
      format: onedecimal
    }
    column value #npsindex {
      label: "NPS Index"
      value: @index.NPS
      rowHeader: true
      format: onedecimal
      align: center
    }

    column value #needsindex {
      label: "Needs Index"
      value: @index.Needs
      rowHeader: true
      format: onedecimal
      align: center
    }
    column value #valueindex {
      label: "Value Index"
      value: @index.Value
      rowHeader: true
      format: onedecimal
      align: center
    }
    column value #relindex {
      label: "Relationship Index"
      value: @index.Relationship
      rowHeader: true
      format: onedecimal
      align: center
    }
    column value #techindex {
      label: "Tech Index"
      value: @index.Technology
      rowHeader: true
      format: onedecimal
      align: center
    }



  }

  widget accountList {
    filter expression {
      value: @daterange.L12MonthTC
      filtertype: "postAggregate"
    }

    showTotals: true
    label: "Team Feeling Validation"
    table:todo //accounts:
    //sortColumn: accountName
    //sortOrder: accending
    //navigateTo: "Account Overview"
    size: large

    column value #account {
      label: "Account"
      value:todo //accounts:Name
      rowHeader: true
      //format:long
    }
    column value #responsecount {
      label: "Responses"
      value:todo //COUNT(teamcheck:responseid)
      rowHeader: true
      align: center
    }

    column value #variance {
      label: "Variance"
      value: @dimension.clientfeeling - @dimension.teamfeeling
      rowHeader: true
      format: onedecimal
      align: center
    }

    column value #tfeelinglabel {
      label: "Team Feeling Risk"
      value: @dimension.clientfeeling
      rowHeader: true
      format: feelingrisklevel
      align: center
    }
    column metric #tfeeling {
      label: "Team Feeling Avg"
      value: @dimension.teamfeeling
      rowHeader: true
      format: onedecimal
      align: center
    }
    column value #tnps {
      label: "tNPS"
      value:todo //average(score(teamcheck:Q1))
      rowHeader: true
      format: onedecimal
      align: center
    }
    column value #renew {
      label: "Renew"
      value:todo //average(score(teamcheck:Q2))
      rowHeader: true
      format: onedecimal
      align: center
    }
    column value #benefits {
      label: "Benefits"
      value:todo //average(score(teamcheck:Q8))
      rowHeader: true
      format: onedecimal
      align: center
    }
    column value #experience {
      label: "Experience"
      value:todo //average(score(teamcheck:Q9))
      rowHeader: true
      format: onedecimal
      align: center
    }

//INDEXED SCORE VALIDATION ROWS
    column value #tfeeling2label {
      label: "Team Feeling Index Risk"
      value: @dimension.teamfeelingIDX
      rowHeader: true
      //format: onedecimal
      align: center
      format: feelingrisklevel
    }
    column metric #tfeeling2 {
      label: "Team Feeling Index"
      value: @dimension.teamfeelingIDX
      rowHeader: true
      format: onedecimal
      align: center
    }
    column value #tnpsindex {
      label: "tNPS Index"
      value: @index.tNPS
      rowHeader: true
      format: onedecimal
      align: center
    }

    column value #renewindex {
      label: "Renew Index"
      value: @index.Renew
      rowHeader: true
      format: onedecimal
      align: center
    }
    column value #benefitsindex {
      label: "Benefits Index"
      value: @index.Benefits
      rowHeader: true
      format: onedecimal
      align: center
    }
    column value #experienceindex {
      label: "Experience Index"
      value: @index.Experience
      rowHeader: true
      format: onedecimal
      align: center
    }
  }

  widget accountList {
    showTotals: true
    label: "Doing Validation"
    table:todo //accounts:
    //sortColumn: accountName
    //sortOrder: accending
    //navigateTo: "Account Overview"
    size: large

    column value #account {
      label: "Account"
      value:todo //accounts:Name
      rowHeader: true
      //format:long
    }
    column value #responsecount {
      label: "Responses"
      value:todo //COUNT(relationship:responseid)
      rowHeader: true
      align: center
    }
    column value #contacts {
      label: "# of invites"
      value:todo //COUNT(respondent:, InYear(respondent:smtpstatusDate, 0, 0, 2018-12-31))
      rowHeader: true
      align: center
    }
    column value #responseindex {
      label: "Response Rate Index"
      value: @index.ResponseRate
      rowHeader: true
      align: center
    }
    column value #responserisk {
      label: "Response Rate Risk"
      value: @index.ResponseRate
      rowHeader: true
      align: center
      format: indexrisklevel
    }
    column metric #LeadScore {
      label: "Marketing Engagement"
      value:todo //average(LeadScore:mkto71_Lead_Score)
      format: nodecimal
      align: center
    }


  }

}

page account #Response {
  label: "Response"

  //modal: true
  widget contactSurveyResponse {

      //    showUnanswered: false   //true    
    view title #defaultSurveyResponseTitle {
    }
    size: medium


    surveyResponseTitle {
      tile title #rt {
        value: contacts:FirstName + " " + contacts:LastName + " - Relationship Survey"
        surveyName: "Relationship Survey"
        view: defaultSurveyResponseTitle
      }
    }

    summary {
      rows: 4

      tile list #list1 {
        item value {
          value: relationship:status
          label: "Status"
        }
        item date {
          value: relationship:interview_start
          label: "Feedback Received"
          format: long
        }
      }
      tile list #list2 {
        item value {
          value: "Relationship Survey"
          label: "Source"
        }
        item value {
          value: relationship:responseid
          label: "Response ID"
        }
      }
    }
 // end of summary

    tab {
      label: "Responses"
      tile list {
        label: " "
        item comment {
          label: "First Name"
          value: contacts:FirstName
        }
        item comment {
          label: "Last Name"
          value: contacts:LastName
        }
        item comment {
          label: "Company name"
          value:todo //accounts:Name
        }
        item comment {
          label: "Title"
          value: contacts:Title
        }
        item comment {
          label: "Customer Type"
          value:todo //accounts:ClientType
        }
        item comment {
          label: "Role"
          value: contacts:ContactRole
        }
      }
      tile list {
        label: "Key Metrics"
        item bar {
          label: "Likelihood to Recommend"
          value:todo //average(score(relationship:q1))
        }
        item bar {
          label: "Satisfaction with Relationship"
          value:todo //average(score(relationship:q4))
        }
        item bar {
          label: "Satisfaction with Technology"
          value:todo //average(score(relationship:q7))
        }
        item comment {
          label: "Overall satisfaction comment"
          value: relationship:Q6
        }
      }
      tile list {
        label: "Product"
        item bar {
          label: "Product is reliable"
          value:todo //average(score(relationship:q9.1))
        }
        item bar {
          label: "Product is user friendly"
          value:todo //average(score(relationship:q9.2))
        }
        item bar {
          label: "Product fulfills business needs"
          value:todo //average(score(relationship:q9.3))
        }
      }

      tile list {
        label: "Service"
        item bar {
          label: "Working with Confirmit added value"
          value:todo //average(score(relationship:q3))
        }
        item bar {
          label: "Confirmit can continue to support business needs"
          value:todo //average(score(relationship:q12))
        }
        item comment {
          label: "Why support business needs"
          value: relationship:Q5
        }
        item comment {
          label: "Areas of Improvement"
          value: relationship:Q11
        }
      }
    }
  }
}

page #Datavalidation {
  label: "Data validation"


  widget metricsBeta {


    view metricWithBar #metric {
      backgroundColorFormatter: backgroundColorFormatter
      valueColorFormatter: valueColorFormatter
      chartColorFormatter: metricbar
      fontSize: small
      roundCorners: false
    }

    label: "Date Periods"
    size: medium

    tile header {
      item title {
        value: ""
      }
      item title {
        value: "Start Current"
        align: left
      }
      item title {
        value: "End Current"
        align: left
      }
      item title {
        value: "Start Prev"
        align: left
      }
      item title {
        value: "End Prev"
        align: left
      }
    }

    tile row #revL12M {
      item value {
        value: "Revenue - Last 12 months"
       // rowHeader: true
      }
      item value {
        value: todo //AddYear(GetDate(), -1)
      //  format: dateDefaultFormatter
      }
      item value {
        value: todo //GetDate()
       // format: dateDefaultFormatter
      }
      item value {
        value: todo //AddYear(GetDate(), -2)
      //  format: dateDefaultFormatter
      }
      item value {
        value: todo //AddYear(GetDate(), -1)
       // format: dateDefaultFormatter
      }
    }

    tile row #relL12M {
      item value {
        value: "Relationship - Last 12 months"
      //  rowHeader: true
      }
      item value {
        value: todo //AddYear(GetDate(), -1)
        //format: dateDefaultFormatter
      }
      item value {
        value: todo //GetDate()
       // format: dateDefaultFormatter
      }
      item value {
        value:todo //AddYear(GetDate(), -2)
      //  format: dateDefaultFormatter
      }
      item value {
        value:todo //AddYear(GetDate(), -1)
      //  format: dateDefaultFormatter
      }
    }

    tile row #tcL12M {
      item value {
        value: "Team Check - Last 12 months"
      //  rowHeader: true
      }
      item value {
        value:todo //AddMonth(AddYear(GetDate(), -1), -1)
        //format: dateDefaultFormatter
      }
      item value {
        value:todo //AddMonth(GetDate(), -1)
       // format: dateDefaultFormatter
      }
      item value {
        value:todo //AddMonth(AddYear(GetDate(), -2), -1)
        //format: dateDefaultFormatter
      }
      item value {
        value:todo //AddMonth(AddYear(GetDate(), -1), -1)
       // format: dateDefaultFormatter
      }
    }
//
    tile row #combL12M {
      item value {
        value: "Combined - Last 12 months (Rel Start Date)"
      //  rowHeader: true
      }
      item value {
        value:todo //AddYear(GetDate(), -1)
       // format: dateDefaultFormatter
      }
      item value {
        value:todo //GetDate()
      //  format: dateDefaultFormatter
      }
      item value {
        value:todo //AddYear(GetDate(), -2)
        //format: dateDefaultFormatter
      }
      item value {
        value:todo //AddYear(GetDate(), -1)
       // format: dateDefaultFormatter
      }
    }
    tile row #casesL12M {
      item value {
        value: "Cases - Last 12 months"
      //  rowHeader: true
      }
      item value {
        value:todo //AddYear(GetDate(), -1)
        //format: dateDefaultFormatter
      }
      item value {
        value:todo //GetDate()
        //format: dateDefaultFormatter
      }
      item value {
        value:todo //AddYear(GetDate(), -2)
       // format: dateDefaultFormatter
      }
      item value {
        value:todo //AddYear(GetDate(), -1)
       // format: dateDefaultFormatter
      }
    }


  }

  widget metricsBeta {


    view metricWithBar #metric {
      backgroundColorFormatter: backgroundColorFormatter
      valueColorFormatter: valueColorFormatter
      chartColorFormatter: metricbar
      fontSize: small
      roundCorners: false
    }

    label: "Date Periods"
    size: medium

    tile header {
      item title {
        value: ""
      }
      item title {
        value: "Start Current"
        align: left
      }
      item title {
        value: "End Current"
        align: left
      }
      item title {
        value: "Start Prev"
        align: left
      }
      item title {
        value: "End Prev"
        align: left
      }
    }

    tile row #revL12M {
      item value {
        value: "Revenue - Selected Period"
       // rowHeader: true
      }
      item value {
        value: ""
      }
      item value {
        value: ""
      }
      item value {
        value: ""
      }
      item value {
        value: ""
      }
    }

    tile row #relsPeriod {
      item value {
        value: "Relationship - Selected Period"
      //  rowHeader: true
      }
      item value {
        value: ""
      }
      item value {
        value: ""
      }
      item value {
        value: ""
      }
      item value {
        value: ""
      }
    }

    tile row #tcsPeriod {
      item value {
        value: "Team Check - Selected Period"
      //  rowHeader: true
      }
      item value {
        value: ""
      }
      item value {
        value: ""
      }
      item value {
        value: ""
      }
      item value {
        value: ""
      }
    }

    tile row #combsPeriod {
      item value {
        value: "Combined - Selected Period"
      //  rowHeader: true
      }
      item value {
        value: ""
      }
      item value {
        value: ""
      }
      item value {
        value: ""
      }
      item value {
        value: ""
      }
    }
    tile row #casesSPeriod {
      item value {
        value: "Cases - Selected Period"
      //  rowHeader: true
      }
      item value {
        value: ""
      }
      item value {
        value: ""
      }
      item value {
        value: ""
      }
      item value {
        value: ""
      }
    }


  }

  widget accountList {
    showTotals: true
    label: "Doing Validation"
    table:todo //accounts:
    // sortColumn:todo //sum
    // sortOrder: descending
    //navigateTo: "Account Overview"
    size: large

    column value #account {
      label: "Account"
      value:todo //accounts:Name
      rowHeader: true
      //format:long
    }

    column value #active {
      label: "Is Active"
      value:todo //accounts:ActiveClient
    }

    column metric #overallrisk {
      label: "Risk Assessment"
      value: @calculate.riskassessment
      format: indexrisklevel
      align: center
    }
    column metric #sum {
      label: "Sum of Factors"
      value: @calculate.sumofdimensionsIDX
      //format: nodecimal
      align: center
    }
    column value #responserate {
      label: "Response Rate Index"
      value: @index.ResponseRate
      rowHeader: true
      align: center
    }

    column value #revL12M {
      label: "Last 12Mth Revenue"
      value:todo //sum(opportunities:Amount_USD, @daterange.L12MonthRev)
      format: UScurrency
      align: right
    }
    column value #revP12M {
      label: "Prev 12Mth Revenue"
      value:todo //sum(opportunities:Amount_USD, @daterange.P12MonthRev)
      format: UScurrency
      align: right
    }

    column value #SpendTrend {
      label: "Growth Index"
      value: @index.SpendTrend
      rowHeader: true
      align: center
    }
    column value #adoption {
      label: "User Adoption Index"
      value: @index.UserAdoption
      rowHeader: true
      align: center
    }
    column value #LeadScore {
      label: "Marketing Engagement Index"
      value: @index.LeadScore
      rowHeader: true
      align: center
    }
  }

  widget accountList {
    showTotals: false
    label: "RVA"
    table: licenses:
    // sortColumn: id
    // sortOrder: ascending
    //navigateTo: ""
    size: large
    filter expression {
      value: licenses:EUType = "RVA"
    }
    column value #id {
      label: "Company Id"
      value: licenses:ConfirmitId
      align: center
    }
    // column value account {
    //   label: "Account ID"
    //   value: licenses:FullAccountID
    //   align: left
    // }
    // column value accountname {
    //   label: "Account Name"
    //   value: licenses:AccountName
    //   align: left
    // }
    column value #licensedrva {
      label: "RVA Licenses"
      value:todo //sum(licenses:Purchased)
      format: onedecimal
      align: center
    }
    column value #assignedrva {
      label: "RVA Assigned"
      value: licenses:Users//sum(licenses:Users)
      format: onedecimal
      align: center
    }
    column value #type {
      label: "Type"
      value: licenses:EUType
      align: center
    }
    column value #server {
      label: "Environment"
      value: licenses:Server
      align: center
    }

  }

}

page #GiveUsFeedback {
  label: "Give Us Feedback"


  widget markdown {
    size: small
    label: "Your Feedback Is Important. We're listening!"
    markdown: "[Let Us Know Before You Go](https://survey.euro.confirmit.com/wix/3/p1871616863.aspx)"
  }

}

page #DrillDown {
  label: "DrillDown"

  //modal: true


  widget contactList #hg {
    label: "Response history"
    table: relationship:
    sortColumn: surveyDate
    sortOrder: descending
    size: medium


    view metric #metrics {
      backgroundColorFormatter: backgroundColorFormatter
      valueColorFormatter: valueColorFormatter
      fontSize: small
    }

    column date #inviteDate {
      label: "Request Date"
      value: respondent:smtpstatusDate
      format: dateDefaultFormatter
    }
    column date #surveyDate {
      label: "Response Date"
      value: relationship:interview_start
      format: dateDefaultFormatter
    }

    column value #survey {
      label: "Survey"
      value: "Relationship"
    }

    column metric #ltr {
      label: "LTR"
      value:todo //average(score(relationship:Q1))
      view: metrics
      target: 9
      align: center
    }

    column value #comments {
      label: "Comments"
      value: relationship:Q2
    }
  }
}

`;
