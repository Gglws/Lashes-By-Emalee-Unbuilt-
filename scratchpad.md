//check boxes
 <div class="mb-3">
        <div class="form-check">
          <input class="form-check-input" type="checkbox" id="extraProduct1">
          <label class="form-check-label" for="extraProduct1">
            Glue Support (Primer)
          </label>
        </div>
      </div>
      <div class="mb-3">
        <div class="form-check">
          <input class="form-check-input" type="checkbox" id="extraProduct2">
          <label class="form-check-label" for="extraProduct2">
            Supreme Bonder
          </label>
        </div>
      </div>
      <div class="mb-3">
        <div class="form-check">
          <input class="form-check-input" type="checkbox" id="extraProduct3">
          <label class="form-check-label" for="extraProduct3">
            Cleanser
          </label>
        </div>
      </div>


//appointment info
<div class="mb-3">
        <label class="form-label">Curl</label>
        <select id="newCurl" class="form-select">
          <option>C</option>
          <option>CC</option>
          <option>D</option>
          <option>L</option>
          <option>M</option>
        </select>
      </div>
      <div class="mb-3">
        <label class="form-label">Glue</label>
        <select id="New Glue" class="form-select">
          <option>Four Seasons</option>
          <option>Uh Huh Honey Clear</option>
        </select>
      </div>
      <div class="mb-3">
        <label class="form-label">Lash Style</label>
        <select id="newLashStyle" class="form-select">
          <option>Classic</option>
          <option>Volume</option>
          <option>Hybrid</option>
          <option>Mega Volume</option>
          <option>Anime</option>
          <option>Wispy</option>
          <option>Cat Eye</option>
          <option>Doll</option>
          <option>Dramatic</option>
          <option>Baby Doll</option>
        </select>
      </div>
      <div class="mb-3">
        <label class="form-label">Length</label>
        <select id="newLength" class="form-select">
          <option>5mm</option>
          <option>6mm</option>
          <option>7mm</option>
          <option>8mm</option>
          <option>9mm</option>
          <option>10mm</option>
          <option>11mm</option>
          <option>12mm</option>
          <option>13mm</option>
          <option>14mm</option>
          <option>15mm</option>
          <option>16mm</option>
          <option>17mm</option>
          <option>18mm</option>
        </select>
      </div>
      <div class="mb-3">
        <label class="form-label">Thickness</label>
        <select id="newThickness" class="form-select">
          <option>.03mm</option>
          <option>.04mm</option>
          <option>.05mm</option>
          <option>.06mm</option>
          <option>.07mm</option>
          <option>.08mm</option>
          <option>.09mm</option>
          <option>.10mm</option>
          <option>.11mm</option>
          <option>.12mm</option>
          <option>.13mm</option>
          <option>.14mm</option>
          <option>.15mm</option>
          <option>.16mm</option>
          <option>.17mm</option>
          <option>.18mm</option>
          <option>.19mm</option>
          <option>.20mm</option>
          <option>.21mm</option>
          <option>.22mm</option>
          <option>.23mm</option>
          <option>.24mm</option>
          <option>.25mm</option>
          <option>.26mm</option>
          <option>.27mm</option>
          <option>.28mm</option>
          <option>.29mm</option>
          <option>.30mm</option>
        </select>
      </div>






      And if you did want to use JQuery, I discovered that you definitely DO need to use 
$.ajax()
 to make your stupid POST requests or else your 
app.use(express.json())
 won't ever pick anything up out of your request body