
$.getJSON('/lead/summary-by-lead-source', function(results) {
  results = _.map(_.zip(_.keys(results), _.values(results)), function(value) {
    return {
      description: value[0], 
      lead_count: value[1]
    };
  });

  summaryByLeadSourceData = _.map(results, function(leadSourceDataPoint) {
    return {
      value: leadSourceDataPoint.lead_count,
      color: 'hsl(' + (180 * leadSourceDataPoint.lead_count/ results.length) 
        + ', 100%, 50%)',
      label: leadSourceDataPoint.description
    };
  });

  var byLeadSourceContext = $("#pie-by-lead-source").get(0).getContext("2d");
  var byLeadSourceChart = 
    new Chart(byLeadSourceContext).Pie(summaryByLeadSourceData);
});

$.getJSON('/lead/summary-by-city', function(results) {
  results = _.map(_.zip(_.keys(results), _.values(results)), function(value) {
    return {
      city: value[0], 
      lead_count: value[1]
    };
  });

  summaryByCityData = _.map(results, function(cityDataPoint) {
    return {
      value: cityDataPoint.lead_count,
      color: 'hsl(' + (180 * cityDataPoint.lead_count/ results.length) 
        + ', 100%, 50%)',
      label: cityDataPoint.city
    };
  });

  var byCityContext = $("#pie-by-city").get(0).getContext("2d");
  var byCityChart = new Chart(byCityContext).Pie(summaryByCityData);
});
