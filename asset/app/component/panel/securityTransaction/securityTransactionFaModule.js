﻿(function () {
    "use strict";
    angular
        .module('securityTransactionFa', ['kendo.directives', 'ngMaterial', 'ngMessages', 'material.svgAssetsCache'])
        .config(routeconfig);

    function routeconfig($stateProvider) {
        $stateProvider.state('panel_fa.securityTransaction', {
            url: '/securityTransaction',
            templateUrl: "asset/app/component/panel/securityTransaction/securityTransactionFa.tpl.html",
            controller: 'securityTransactionFaCtrl'
        });
    }

    angular
        .module('securityTransactionFa')
        .config(function ($mdThemingProvider) {
            $mdThemingProvider.theme('docs-dark', 'default')
                .primaryPalette('yellow')
                .dark();
        });

    angular
        .module('securityTransactionFa')
        .controller('securityTransactionFaCtrl', function ($scope, $state, $timeout) {
            $scope.ManagementTypeCode = '0';
            $scope.tradeReportDatePickerFrom = moment(new Date()).add(-10, 'days').format('jYYYY/jMM/jDD');
            $scope.tradeReportDatePickerTo = moment(new Date()).add(-1, 'days').format('jYYYY/jMM/jDD');
            $scope.datepickerConfig = {
                allowFuture: false,
                dateFormat: 'jYYYY/jMM/jDD',
                gregorianDateFormat: 'YYYY-MM-DD',
                minDate: moment.utc('2015', 'YYYY')
            };

            $scope.tradeReportView = 2;
            $scope.tradeReportTransactionType = 1000;

            $timeout(function () {
                $scope.tradeReportGenerate();
            }, 0);

            $scope.tradeReportGenerate = function () {
                if ($scope.Form.managementTypeCode.$valid) {
                var isin = $("#tradeReportProductAutoComHidden").val();
                $scope.getTradeReport(isin, $scope.tradeReportTransactionType, $scope.ManagementTypeCode, $scope.tradeReportView, moment($scope.tradeReportDatePickerFrom, 'jYYYY/jMM/jDD').format('YYYY-MM-DD'), moment($scope.tradeReportDatePickerTo, 'jYYYY/jMM/jDD').format('YYYY-MM-DD'));
                } else {
                    $scope.showCustomToast('0');
                }
                };

            $scope.monthSelectorOptions = {
                start: "year",
                depth: "year"
            };

            $scope.getType = function (x) {
                return typeof x;
            };

            $scope.isDate = function (x) {
                return x instanceof Date;
            };

            $scope.tradeReportProductAutoCom = {
                dataSource: {
                    transport:
                    {
                        read: {
                            type: "GET",
                            dataType: "json",
                            contentType: "application/json; charset=utf-8",
                            url: $scope.apiReference.getSimpleProducts,
                            data: AppControlFacility.onAdditionalData
                        },
                        prefix: ""
                    },
                    serverFiltering: true,
                    filter: [],
                    schema: {
                        data: "Result"
                    }
                },
                placeholder: $scope.content.SelectProducts,
                template: '<span>#: data.SymbolEn # --- #: data.ProductNameEn  #</span>',
                dataTextField: "SymbolEn",
                dataValueField: "Isin",
                filter: "contains",
                select: AppControlFacility.onSelectDataItem,
                minLength: 3
            };

            $scope.getTradeReport = function(isin, type, managementType, viewType, startDate, endDate) {


                var filter = {
                    "Isin": isin,
                    "TransactionTypes": [
                        type
                    ],
                    "TradeDailyAggregationType": viewType,
                    "ExecutionPriceOperatorCriteria": 1,
                    "ExecutionPrice": 0,
                    "QuantityOperatorCriteria": 1,
                    "Quantity": 0,
                    "NetAmountOperatorCriteria": 1,
                    "NetAmount": 0,
                    "GivenLanguage": 1,
                    "DateFilter": {
                        "StartDate": startDate,
                        "EndDate": endDate
                    },
                    "ContractType": managementType
                };

                $("#tradeReportGrid1").kendoGrid({
                    toolbar: [{ name: 'excel', text: 'خروجی به اکسل' }],
                    excel: {
                        fileName: "TradeReportEn.xlsx",
                        proxyURL: $scope.apiReference.gridExcelExport,
                        filterable: true,
                        forceProxy: true,
                        allPages: true
                    },
                    dataSource: {
                        transport: {
                            read: function (options) {
                                $.ajax({
                                    type: "POST",
                                    url: $scope.apiReference.getTrades,
                                    data: {
                                        ReportFilter: filter,
                                        optionalFilter: options.data
                                    },
                                    dataType: "json",
                                    headers: {
                                        'Authorization': 'Bearer ' + key
                                    },
                                    success: function (result) {
                                        console.log(result);
                                        if (result.Message != "1000") { $scope.showCustomToast(result.Message); }
                                        options.success(result);

                                        for (var i = $("td").length; i >= 1; i--) {
                                            var temp = $("td").eq(i).text()
                                            if (temp === 'خرید') {
                                                $("td").eq(i).parent("tr").addClass("tablebuy");
                                                $("td").eq(i).parent("tr").children("td").eq(0).addClass("tablesellborder");
                                                
                                                
                                            } else if (temp === 'فروش') {
                                                $("td").eq(i).parent("tr").addClass("tablesell");
                                                $("td").eq(i).parent("tr").children("td").eq(0).addClass("tablebuyborder");
                                            } 
                                          
                                        }


                                    },
                                    error: function (xhr, ajaxOptions, thrownError) {
                                        if (xhr.status === 401) {
                                            key = null;
                                            $state.go('loginEn', "");
                                            delete $localStorage.key;
                                        }
                                    }
                                });
                            }
                        },
                        schema: {
                            data: "Result",
                            total: "TotalRecords",
                            model: {
                                fields: {
                                    ProductNameEn: "ProductNameEn",
                                    ProductSymbolEn: "ProductSymbolEn",
                                    Volume: "Volume",
                                    Price: "Price",
                                    TotalFee: "TotalFee",
                                    BrokerFee: "BrokerFee",
                                    TicketNumber: "TicketNumber",
                                    Date: "Date",
                                    TotalPrice: "TotalPrice",
                                    TransactionTypeTitle: "TransactionTypeTitle",
                                    NetAmount: "NetAmount",
                                    AvgBoockCost: "AvgBoockCost",
                                    Tax: "Tax",
                                    CouponAmount: "CouponAmount"
                                }
                            }
                        },
                        pageSize: 25,
                        serverPaging: true,
                        serverSorting: true
                    },
                    height: 440,
                    autoBind: true,
                    sortable: true,
                    resizable: true,
                    reorderable: true,
                    navigatable: true,
                    columnMenu: true,
                    //groupable: true,
                    pageable: {
                        pageSizes: [10, 25, 50, 100],
                        buttonCount: 5
                    },
                    allowCopy: true,
                    selectable: {
                        mode: "GridSelectionMode.Multiple",
                        type: "GridSelectionType.Row"
                    },
                    columns: [{
                        field: "ProductNameFa",
                        title: $scope.content.ProductName
                        //width: "110px"
                    },
                    {
                        field: "ProductSymbolFa",
                        title: $scope.content.Symbol
                        //width: "60px"
                    },
                    {
                        field: "Volume",
                        title: $scope.content.Volume,
                        //width: "70px",
                        format: "{0:n0}"
                    },
                    {
                        field: "Price",
                        title: $scope.content.Price,
                        //width: "70px",
                        format: "{0:n0}"
                    },
                    {
                        field: "Date",
                        title: $scope.content.Date,
                        //width: "80px",
                        template: "#= moment(kendo.toString(kendo.parseDate(Date, 'yyyy-MM-dd'), 'yyyy-MM-dd'), 'YYYY-M-D').format('jYYYY/jM/jD') #"
                    },
                     {
                         field: "TransactionTypeTitle",
                         title: $scope.content.Type,
                         template: "#= TransactionTypeTitle == 'Buy' ? 'خرید' :  TransactionTypeTitle = 'فروش' #"
                         //width: "50px"
                     },
                    {
                        field: "NetAmount",
                        title: $scope.content.NetAmount,
                        //width: "80px",
                        format: "{0:n0}"
                    },
                    {
                        field: "AvgBoockCost",
                        title: $scope.content.AverageBookCost,
                        //width: "80px",
                        format: "{0:n0}"
                    },
                    {
                        field: "BrokerFee",
                        title: $scope.content.BrokerFee,
                        //width: "70px",
                        format: "{0:n0}",
                        hidden: true
                    },
                    {
                        field: "TotalFee",
                        title: $scope.content.TotalFee,
                        //width: "70px",
                        format: "{0:n0}"
                    },
                    {
                        field: "Tax",
                        title: $scope.content.Tax,
                        //width: "70px",
                        format: "{0:n0}"
                    },
                    {
                        field: "CouponAmount",
                        title: $scope.content.AccruedInterest,
                        //width: "70px",
                        format: "{0:n0}"
                    },
                    {
                        field: "TicketNumber",
                        title: $scope.content.TicketNumber,
                        hidden: true
                        //width: "70px"
                    }]
                });
            };

    
        });

})();


