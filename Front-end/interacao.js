
document.getElementById('openFormButton').addEventListener('click', function() {
    document.getElementById('overlay').style.display = 'flex';
  });

  document.getElementById('fecharJanela').addEventListener('click', function() {
    document.getElementById('overlay').style.display = 'none';
  });

  document.getElementById('usuario').addEventListener('click', function() {
    document.getElementById('overlay2').style.display = 'flex';
  });

  document.querySelector('.sair').addEventListener('click', function() {
    document.getElementById('overlay').style.display = 'none';
  });

  document.getElementById('excluir').addEventListener('click', function() {
    document.getElementById('overlay3').style.display = 'flex';
  });
  document.getElementById('fechar').addEventListener('click', function() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('overlay2').style.display = 'none';
  });

  document.getElementById('janelafechar').addEventListener('click', function() {
    document.getElementById('overlay3').style.display = 'none';
  });