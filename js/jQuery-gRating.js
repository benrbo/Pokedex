(function($) {
  $.fn.grating = function(options) {
    $.fn.grating.defaultOptions = {
      enabled: true,
      allowDeselect: true,
      character: "&#9733;",
      elementType: "span",
      elementCount: 5,
      clicklimit: 0,
      defaultValue: 0,
      required: false,
      validationClass: "form-control",
      validationText: "Rating is required",
      callback: null,
      ratingCss: {
        fontSize: "30px",
        color: "#000",
        opacity: ".5",
        cursor: "pointer",
        padding: "0 10px",
        transition: "all 150ms",
        display: "inline-block",
        transform: "rotateX(45deg)",
        transformOrigin: "center bottom",
        textShadow: "none"
      },
      ratingHoverCss: {
          color: "rgb(255, 193, 97)",
        opacity: "1",
        transform: "rotateX(0deg)",
        textShadow: "0 0 30px #ffc"
      }
    };

    var base = {};
    base.$elems = this;

    base.$elems.data("gRating", base);

    var output = {
      enable: function(isEnabled)
      { 
         base.options.enabled = isEnabled;

         base.$elems.each(function()
         {
           var _this = this;
           _this.$this = $(this);
           _this.$this.children(base.options.elementType).css('cursor', 'default');
           if(isEnabled)
            _this.$this.attr("data-clickCount", 0);
         });
         return base.$elems;
      },
      val: function(index)
      { 
        var values = {};
        base.$elems.each(function(key, value)
        {
          var _this = this;
          _this.$this = $(this);
          var id = getUniqueId(_this.$this, key);
          values[id] = _this.$this.attr("value");
       });
       if(Object.keys(values).length == 1)
        values = values[Object.keys(values)[0]];
       if(IsNullOrEmpty(index) == false && values[index] !== undefined)
        values = values[index];
       return values;
      }
    };

    init();

 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
    if (!Object.keys) {
      Object.keys = (function() {
        'use strict';
        var hasOwnProperty = Object.prototype.hasOwnProperty,
            hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
            dontEnums = [
              'toString',
              'toLocaleString',
              'valueOf',
              'hasOwnProperty',
              'isPrototypeOf',
              'propertyIsEnumerable',
              'constructor'
            ],
            dontEnumsLength = dontEnums.length;

        return function(obj) {
          if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
            throw new TypeError('Object.keys called on non-object');
          }

          var result = [], prop, i;

          for (prop in obj) {
            if (hasOwnProperty.call(obj, prop)) {
              result.push(prop);
            }
          }

          if (hasDontEnumBug) {
            for (i = 0; i < dontEnumsLength; i++) {
              if (hasOwnProperty.call(obj, dontEnums[i])) {
                result.push(dontEnums[i]);
              }
            }
          }
          return result;
        };
      }());
    }

    
    function init()
    {
      base.options = $.extend(true, {}, $.fn.grating.defaultOptions, options);
      base.$elems.each(function(key, value)
      {
        var _this = this;
        _this.$this = $(this);
        _this.$this.data("data-clickCount", 0);

        var count = GetElementCount(_this.$this);
        var character = GetCharacter(_this.$this);
        var required = GetRequired(_this.$this);
        var errorText = GetValidationErrorText(_this.$this);
    
        if(_this.$this.children(base.options.elementType).length == count)
        {
          return;
        }
        var frag = $(document.createDocumentFragment());
        var id = "gRating_validation_input_for_" + getUniqueId(_this.$this, key);
        var inputElement = $("<input type='hidden' id='"+id+"' name='"+id+"' data-error=\""+errorText+"\">");
        if(required)
        {
          inputElement.attr("data-validate", "true");
          inputElement.addClass(base.options.formValidationClass);
          inputElement.attr("required", "required");
          inputElement.attr("data-minlength", "1");
          var helpBlock = $("<div class='help-block with-errors'></div>");
          frag.append(helpBlock);
        }
        frag.append(inputElement);
        for (var i = 1; i < count + 1; i++)
        {
          var characterValue = typeof character === "function" ? GetAwesomeIcon(character(i - 1)) : character;

          var element = $("<"+base.options.elementType+">" + characterValue + "</"+base.options.elementType+">");
          element.data("data-count", i);
          frag.append(element);
        }
        _this.$this.append(frag);
        var children = _this.$this.children(base.options.elementType);
        children.css(base.options.ratingCss);
        children.hover(function(e)
        {
          if(IsEnabled(_this.$this))
          {
            if(e.type === "mouseenter")
              $(this).css(base.options.ratingHoverCss);
            else
              $(this).css(base.options.ratingCss);
          }
        });
        children.mouseenter(function()
        {
          if(IsEnabled(_this.$this))
            populateRatingElements(_this.$this, $(this).data("data-count"));
        });
        children.click(function()
        {
          if(IsEnabled(_this.$this))
          {
            _this.$this.data("data-clickCount", parseInt(_this.$this.data("data-clickCount")) + 1);
            if(HasExceededclicklimit(_this.$this))
            {
              _this.$this.attr('disabled', 'disabled');
              _this.$this.children(base.options.elementType).css('cursor', 'default');
              return;
            }
            var value = $(this).data("data-count");
            var deselectable = GetDeselectable(_this.$this);
            if(deselectable && _this.$this.attr("value") == value)
            {
              value = 0;
            }
            _this.$this.attr("value", value);

            if(value == 0)
              inputElement.removeAttr("value");
            else
              inputElement.attr("value", value);

            populateRatingElements(_this.$this, value);

            if(typeof base.options.callback === "function")
              base.options.callback(_this.$this, value);
          }
        });
        /* Mouseleave on parent element reset back to last clicked element */
        _this.$this.mouseleave(function()
        {
          if(IsEnabled(_this.$this))
            populateRatingElements(_this.$this, _this.$this.attr("value"));
        });
        /* Set initial value for rating */
        var value = GetValue(_this.$this, count);
        _this.$this.attr("value", value);

        /* Only add a value if its above 0 so we can trigger validation errors */
        if(value > 0)
          inputElement.attr("value", value);

        /* Draw the rating with the preselected value visible */
        populateRatingElements(_this.$this, value);

        /* If the parent is disabled default the mouseover icon to the correct state */
        if(IsEnabled(_this.$this) == false)
        {
          _this.$this.children(base.options.elementType).css('cursor', 'default');
        }
      });
    }

    /*
      Attempts to clean dirty input to true or false
      If a value is not caught or recognised will return false
    */
    function GetTrueOrFalse(value)
    {
        if(IsNullOrEmpty(value) == false)
        {
          return (value ==true || value == 1 || value == "true" || value == "1" || value == "t");
        }
        return false;
    }

    /*
      Returns deselectable == "true" if found on the selector data-deselectable
      Returns options.allowDeselect if not found
    */
    function GetDeselectable(selector)
    {

        return typeof selector.attr("data-deselectable") !== "undefined" ? GetTrueOrFalse(selector.attr("data-deselectable")) : base.options.allowDeselect
    }

    /*
      Checks for properties on the selector to find a uniqueKey in the following OnErrorResolvingImageDirectory
      * attribute id
      * attribute name

      If neither was found returns the defaultValue
    */
    function getUniqueId(selector, defaultValue)
    {
      var uniqueKey = "";

      var id = selector.attr("id");
      if(IsNullOrEmpty(id) == false)
      {
        uniqueKey = id;
      }
      else
      {
        var name = selector.attr("name");
        if(IsNullOrEmpty(name) == false)
        {
          uniqueKey = name;
        }
        else
        {
          id = defaultValue;
        }
      }

     return uniqueKey;
    }
    /*
      Convenience function to combine undefined, null and value empty checks
    */
    function IsNullOrEmpty(value)
    {
      return (typeof value === "undefined" || value == "" || value == null);
    }

    /*
      Returns validation data-error content if found on the selector data-error
      Returns options.validationText if not found
    */
    function GetValidationErrorText(selector)
    {
      return typeof selector.attr("data-error") !== "undefined" ? selector.attr("data-error") : base.options.validationText
    }

    /*
      Returns the required state if found on the selector required
      Returns options.required if not found
    */
    function GetRequired(selector)
    {
      return typeof selector.attr("required") !== "undefined" ? selector.attr("required") : base.options.required
    }

    /*
      Gets the current value attribute from the selector
      If the value is undefined returns the defaultValue
      If the value is greater than maxRating value returns the defaultValue
    */
    function GetValue(selector, maxRating)
    {
      var value = selector.attr("value");
      if(IsNullOrEmpty(value))
      {
        value = base.options.defaultValue;
      }
      if(value > maxRating)
      {
        value = 0;
      }
      return value;
    }

    /*
      Checks whether the selector has exceeded the clickCount click limit
      Returns true if so, false otherwise
    */
    function HasExceededclicklimit(selector)
    {
      var limit = Getclicklimit(selector);
      return (limit != 0 && parseInt(selector.data("data-clickCount")) >= limit);
    }

    /*
      Retrieves the Click limit value for the selector
      Returns options.clicklimit if not found
    */
    function Getclicklimit(selector)
    {
      return typeof selector.attr("data-clicklimit") !== "undefined" ? selector.attr("data-clicklimit") : base.options.clicklimit;
    }

    /*
      Retrieves the character value for the selector overriding to the Html data-character value if found first
      Substitues AwesomeIcon html for the character value if the character starts with fa-
      Returns options.character if not found
    */
    function GetCharacter(selector)
    {
      var character = typeof selector.attr("data-character") !== "undefined" ? selector.attr("data-character") : base.options.character;

      //If character starts as a font awesome icon then override and pass out the font awesome icon data
      character = GetAwesomeIcon(character);

      return character;
    }
    
    /*
      Returns the character unmodified unless it starts with fa- then it is assumed to be a font awesome character
      And it is wrapped in a html <i aria-hidden='true'></i> element with the relevant font awesome code
    */
    function GetAwesomeIcon(character)
    {
      //If character starts as a font awesome icon then override and pass out the font awesome icon data
      if(typeof character === "function" == false && character.length > 2 && character.substr(0,3) == "fa-")
      {
        character = "<i class='fa "+character+"' aria-hidden='true'></i>";
      }
      return character;
    }

    /*
      Retrieves the Element count value for the selector overriding to the Html data-max value if found first
      Returns options.elementCount if not found
    */
    function GetElementCount(selector)
    {
      return parseInt(typeof selector.attr("data-max") !== "undefined" ? selector.attr("data-max") : base.options.elementCount)
    }

    /*
      Returns the inverse of the disabled state if found on the selector disabled
      Returns options.enabled if not found
    */
    function IsEnabled(selector)
    {
      return typeof selector.attr("disabled") !== "undefined" ? selector.attr("disabled") == false : base.options.enabled
    }

    /*
      Sets the Css values for all children of the selector up to the value with options.ratingHoverCss otherwise sets options.ratingCss
      Sets all children css to options.ratingCss if value is null
    */
    function populateRatingElements(selector, value)
    {
      selector.children(base.options.elementType).each(function()
      {
        if (IsNullOrEmpty(value) || $(this).data("data-count") > value)
        {
          $(this).css(base.options.ratingCss);
        }
        else
        {
          $(this).css(base.options.ratingHoverCss);
        }
      });
    }

    /* Return the output object result */
    return output;
  };
//Pass the jQuery class so we can use it inside our plugin 'class'
})(jQuery);
