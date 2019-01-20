$(function() {
  //listPays
  $.getJSON('http://10.110.6.168:3000/getPays', function(data) {
    let listPays = data.result;
    let fluxHtml = '';
    listPays.forEach(pays => {
      fluxHtml += '<option value="' + pays.nom + '">' + pays.nom + '</option>';
    });
    $("#listPays").append(fluxHtml);
  });

  $.getJSON('http://10.110.6.168:3000/getEntreprise', function(data) {
    let listEntreprise = data.result;
    let fluxHtml = '';
    listEntreprise.forEach(entreprise => {
      fluxHtml += '<option value="' + entreprise.nom + '">' + entreprise.nom + '</option>';
    });
    $("#listEntreprise").append(fluxHtml);
  });

  $.getJSON('http://10.110.6.168:3000/getEcole', function(data) {
    let listEcole = data.result;
    let fluxHtml = '';
    listEcole.forEach(ecole => {
      fluxHtml += '<option value="' + ecole.nom + '">' + ecole.nom + '</option>';
    });
    $("#listEcole").append(fluxHtml);
  });
});

function sendRequest() {
  const pays = $("#listPays").val();
  const entreprise = $("#listEntreprise").val();
  const ecole = $("#listEcole").val();
  if (pays === '') {
    $("#listResultat").html('<li>Aucun résultat</li>');
    $(".listToSearch").addClass('d-none');
    $("#listEntreprise").val('');
    $("#listEcole").val('');
  } else {
    $(".listToSearch").removeClass('d-none');
    $.ajax({
      contentType: 'application/json',
      data: JSON.stringify({
        "pays": pays,
        "entreprise": entreprise,
        "ecole": ecole
      }),
      dataType: 'json',
      success: function(data){
        const listResult = data.result;
        let fluxHtml = '';
        listResult.forEach((person) => {
          fluxHtml += '<li>' + person.nom + ' ' + person.prenom + '</li>';
        });
        if (fluxHtml === '') {
          fluxHtml = '<li>Aucun résultat</li>';
        }
        $("#listResultat").html(fluxHtml);
      },
      error: function(){
        console.log('error')
      },
      type: 'POST',
      url: 'http://10.110.6.168:3000/getPersonSpe'
    });
  }
}