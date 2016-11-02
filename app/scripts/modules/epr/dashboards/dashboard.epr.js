/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:DashboardDewsCtrl
 * @description
 * # LoginCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('DashboardEprCtrl', [
			'$scope', 
			'$q', 
			'$http', 
			'$location', 
			'$route',
			'$rootScope',
			'$window', 
			'$timeout', 
			'$filter', 
			'ngmUser', 
			'ngmData', 
		function ( $scope, $q, $http, $location, $route, $rootScope, $window, $timeout, $filter, ngmUser, ngmData ) {
			this.awesomeThings = [
				'HTML5 Boilerplate',
				'AngularJS',
				'Karma'
			];

			// empty model
			$scope.model = {
				rows: [{}]
			};

			// create dews object
			$scope.dashboard = {
				
				// parent
				ngm: $scope.$parent.ngm,
				
				// current user
				user: ngmUser.get(),

				// current report
				report: 'report' + $location.$$path.replace(/\//g, '_') + '-extracted-',

				// data
				data: {
					region: {
						'all': {
							name: 'All'
						},
						'central': {
							name: 'Central',
							prov: [ 8,3,4,5,2,1 ]
						},
						'central_highlands': {
							name: 'Central Highlands',
							prov: [ 10,22 ]
						},
						'east': {
							name: 'East',
							prov: [ 13,7,14,6 ]
						},
						'north': {
							name: 'North',
							prov: [ 27,28,18,19,20 ]
						},
						'north_east': {
							name: 'North East',
							prov: [ 15,9,17,16 ]
						},
						'south': {
							name: 'South',
							prov: [ 32,23,34,24,33 ]
						},
						'south_east': {
							name: 'South East',
							prov: [  26,25,12,11 ]
						},
						'west': {
							name: 'West',
							prov: [ 31,21,29,30 ]
						}
					},
					province: {
						'15': 'Badakhshan',
						'29': 'Badghis',
						'9': 'Baghlan',
						'18': 'Balkh',
						'10': 'Bamyan',
						'22': 'Daykundi',
						'31': 'Farah',
						'28': 'Faryab',
						'11': 'Ghazni',
						'21': 'Ghor',
						'32': 'Hilmand',
						'30': 'Hirat',
						'27': 'Jawzjan',
						'1': 'Kabul',
						'33': 'Kandahar',
						'2': 'Kapisa',
						'26': 'Khost',
						'13': 'Kunar',
						'17': 'Kunduz',
						'7': 'Laghman',
						'5': 'Logar',
						'6': 'Nangarhar',
						'34': 'Nimroz',
						'14': 'Nuristan',
						'25': 'Paktika',
						'12': 'Paktya',
						'8': 'Panjsher',
						'3': 'Parwan',
						'19': 'Samangan',
						'20': 'Sar-e-Pul',
						'16': 'Takhar',
						'23': 'Uruzgan',
						'4': 'Wardak',
						'24': 'Zabul',
					}
				},

				// get http request
				getRequest: function( indicator ){
					// 
					return {
						method: 'POST',
						url: 'http://' + $location.host() + '/api/epr/admin/indicator',
						data: {
							indicator: indicator,
							year: $scope.dashboard.year,
							region: $scope.dashboard.region,
							province: $scope.dashboard.province,
							week: $scope.dashboard.week
						}
					}
				},

				// default menu
				getMenu: function(){

					// rows
					var rows = [];
					// for each
					for(var k in $scope.dashboard.data.region){
						rows.push({
							'title': $scope.dashboard.data.region[k].name,
							'param': 'region',
							'active': k,
							'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
							'href': '#/epr/admin/' + $scope.dashboard.year + '/' + k + '/all/' + $scope.dashboard.week
						});
					};
					
					return [{
						'id': 'epr-admin-year',
						'icon': 'search',
						'title': 'Year',
						'class': 'teal lighten-1 white-text',
						'rows': [{
							'title': '2017',
							'param': 'year',
							'active': '2017',
							'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
							'href': '#/epr/admin/2017/' + $scope.dashboard.region + '/' + $scope.dashboard.province + '/' + $scope.dashboard.week
						},{
							'title': '2016',
							'param': 'year',
							'active': '2016',
							'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
							'href': '#/epr/admin/2016/' + $scope.dashboard.region + '/' + $scope.dashboard.province + '/' + $scope.dashboard.week
						}]
					},{
						'id': 'epr-admin-region',
						'icon': 'location_on',
						'title': 'Region',
						'class': 'teal lighten-1 white-text',
						'rows': rows
					}];

				},

				// province rows
				getProvinceRows: function(){
					
					// rows
					var rows = [];
					// provinces by region
					var provinces = $scope.dashboard.data.region[$scope.dashboard.region].prov;

					// angular
					angular.forEach(provinces, function( d, i ){
						rows.push({
							'title': $scope.dashboard.data.province[d],
							'param': 'province',
							'active': d,
							'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
							'href': '#/epr/admin/' + $scope.dashboard.year + '/' + $scope.dashboard.region + '/' + d + '/' + $scope.dashboard.week
						});
					});

					// push to menu
					$scope.dashboard.menu.push({
						'id': 'epr-admin-province',
						'icon': 'location_on',
						'title': 'Province',
						'class': 'teal lighten-1 white-text',
						'rows': rows
					});

				},

				// week rows
				getWeekRows: function() {

					// rows
					var rows = [{
						'title': 'All',
						'param': 'week',
						'active': 'all',
						'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
						'href': '#/epr/admin/' + $scope.dashboard.year + '/' + $scope.dashboard.region + '/' + $scope.dashboard.province + '/all'
					}];

					// for each week
					for(i=1;i<54;i++){
						rows.push({
							'title': 'W'+i,
							'param': 'week',
							'active': i,
							'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
							'href': '#/epr/admin/' + $scope.dashboard.year + '/' + $scope.dashboard.region + '/' + $scope.dashboard.province + '/' + i
						});
					}

					// push to menu
					$scope.dashboard.menu.push({
						'id': 'epr-admin-week',
						'icon': 'date_range',
						'title': 'Report Week',
						'class': 'teal lighten-1 white-text',
						'rows': rows
					});

				},

				// set dashboard
				setDashboard: function(){

					// variables
					$scope.dashboard.year = $route.current.params.year;
					$scope.dashboard.region = $route.current.params.region;
					$scope.dashboard.province = $route.current.params.province;
					$scope.dashboard.week = $route.current.params.week;

					// add menu
					$scope.dashboard.menu = $scope.dashboard.getMenu();

					// title
					$scope.dashboard.title = 'EPR | ' + $scope.dashboard.year;
					$scope.dashboard.subtitle = 'EPR Admin Dashboard';
					
					// region
					if ( $scope.dashboard.region !== 'all' ) {
						$scope.dashboard.title += ' | ' + $scope.dashboard.data.region[$scope.dashboard.region].name;
						$scope.dashboard.subtitle += ' for ' + $scope.dashboard.data.region[$scope.dashboard.region].name + ' Region';

						// province menu
						$scope.dashboard.getProvinceRows();

					}
					// if province
					if ( $scope.dashboard.province !== 'all' ) {
						$scope.dashboard.title += ' | ' + $scope.dashboard.data.province[$scope.dashboard.province]
						$scope.dashboard.subtitle += ', ' + $scope.dashboard.data.province[$scope.dashboard.province] + ' Province';
					}
					// if week
					if ( $scope.dashboard.week !== 'all' ) {
						$scope.dashboard.title += ' | W' + $scope.dashboard.week;
						$scope.dashboard.subtitle += ', EPR Week ' + $scope.dashboard.week;
					}

					// add weeks to menu
					$scope.dashboard.getWeekRows();					

					// report name
					$scope.dashboard.report += moment().format( 'YYYY-MM-DDTHHmm' );
					
					// model
					$scope.model = {
						name: 'epr_admin_dashboard',
						header: {
							div: {
								'class': 'col s12 m12 l12 report-header',
								'style': 'border-bottom: 3px ' + $scope.dashboard.ngm.style.defaultPrimaryColor + ' solid;'
							},
							title: {
								'class': 'col s12 m8 l8 report-title truncate',
								'style': 'font-size: 3.4rem; color: ' + $scope.dashboard.ngm.style.defaultPrimaryColor,
								'title': $scope.dashboard.title,
							},
							subtitle: {
								'class': 'col hide-on-small-only m8 l9 report-subtitle truncate',
								'title': $scope.dashboard.subtitle,
							},
							download: {
								'class': 'col s12 m4 l4 hide-on-small-only',
								downloads: [{
									type: 'pdf',
									color: 'blue',
									icon: 'picture_as_pdf',
									hover: 'Download Admin as PDF',
									request: {
										method: 'POST',
										url: 'http://' + $location.host() + '/api/print',
										data: {
											report: $scope.dashboard.report,
											printUrl: $location.absUrl(),
											downloadUrl: 'http://' + $location.host() + '/report/',
											user: $scope.dashboard.user,
											pageLoadTime: 6200,
											viewportWidth: 1400
										}
									},						
									metrics: {
										method: 'POST',
										url: 'http://' + $location.host() + '/api/metrics/set',
										data: {
											organization: $scope.dashboard.user.organization,
											username: $scope.dashboard.user.username,
											email: $scope.dashboard.user.email,
											dashboard: 'epr_admin',
											theme: 'epr_admin',
											format: 'pdf',
											url: $location.$$path
										}
									}
								}]
							}							
						},
						menu: $scope.dashboard.menu,
						rows: [{
							columns: [{
								styleClass: 's12 m12 l12',
								widgets: [{
									type: 'html',
									card: 'white grey-text text-darken-2',
									style: 'margin:15px; padding-bottom:30px;',
									config: {
										id: 'dashboard-btn',
										html: '<a class="waves-effect waves-light btn right" href="#/epr/admin"><i class="material-icons left">cached</i>Reset Dashboard</a>'
									}
								}]
							}]
						},{
							columns: [{
								styleClass: 's12 m12 l3',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'Total Reports Due',
										request: $scope.dashboard.getRequest('total')
									}
								}]
							},{
								styleClass: 's12 m12 l3',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'Submitted Reports',
										request: $scope.dashboard.getRequest('submitted_reports')
									}
								}]
							},{
								styleClass: 's12 m12 l3',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'Outstanding Reports',
										request: $scope.dashboard.getRequest('outstanding_reports')
									}
								}]
							},{
								styleClass: 's12 m12 l3',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'Duplicate Reports',
										request: $scope.dashboard.getRequest('duplicate_reports')
									}
								}]
							}]
						},{
							columns: [{
								styleClass: 's12 m12 l12',
								widgets: [{
									type: 'table',
									card: 'panel',
									style: 'padding:0px; height: ' + $scope.dashboard.ngm.style.height + 'px;',
									config: {
										style: $scope.dashboard.ngm.style,
										headerClass: 'collection-header red lighten-2',
										headerText: 'white-text',
										headerIcon: 'assignment_late',
										headerTitle: 'Duplicate Reports',
										templateUrl: '/scripts/widgets/ngm-table/templates/epr/epr.list.html',
										tableOptions:{
											count: 10
										},
										request: {
											method: 'POST',
											url: 'http://' + $location.host() + '/api/epr/admin/indicator',
											data: {
												list: true,
												indicator: 'duplicate_reports',
												year: $scope.dashboard.year,
												region: $scope.dashboard.region,
												province: $scope.dashboard.province,
												week: $scope.dashboard.week
											}
										}
									}
								}]
							}]
						},{
							columns: [{
								styleClass: 's12 m12 l12 remove',
								widgets: [{
									type: 'table',
									card: 'panel',
									style: 'padding:0px; height: ' + $scope.dashboard.ngm.style.height + 'px;',
									config: {
										style: $scope.dashboard.ngm.style,
										headerClass: 'collection-header teal lighten-2',
										headerText: 'white-text',
										headerIcon: 'assignment_turned_in',
										headerTitle: 'Reports Submitted',
										templateUrl: '/scripts/widgets/ngm-table/templates/epr/epr.list.html',
										tableOptions:{
											count: 10
										},
										request: $scope.dashboard.getRequest('reports_submitted')
									}
								}]
							}]
						},{
							columns: [{
								styleClass: 's12 m12 l12',
								widgets: [{
									type: 'html',
									card: 'card-panel',
									style: 'padding:0px; height: 90px; padding-top:10px;',
									config: {
										html: $scope.dashboard.ngm.footer
									}
								}]
							}]
						}]
					}

				}

			};

			// set dashboard
			$scope.dashboard.setDashboard();

			// assign to ngm app scope ( for menu )
			$scope.dashboard.ngm.dashboard.model = $scope.model;

		}

	]);