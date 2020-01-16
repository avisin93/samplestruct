export class Pattern {

  public static ONLY_NUMBER_PATTERN: any = /^\d+$/;
  public static ONLY_TWO_DECIMALPLACE_PATTERN: any = /^\d+(\.\d{0,2})?$/;
  public static EMAIL_PATTERN: any = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  public static ONLY_CHARACTERS: any = /^[a-zA-Z]*$/;
  public static PHONE_NUMBER: any = /[+(]?\d{3}[-.)\s]?[\s]?\d{3}[-.]?\d{4}/;
  public static ALPHA_NUMERIC: any = /^[a-z0-9]+$/i;
  public static NUMBER_DASHES_PATTERN: any = /^(\d+-?)+\d+$/;
  public static ALPHA_NUMERIC_WITH_SPACE: any = /^\w+( \w+)*$/;
  public static ALPHA_WITH_SPACE: any = /^[a-zA-Z ]*$/;
  public static ALPHA_NUMERIC_WITH_TRIM_SPACE: any = /^[a-zA-Z0-9][a-zA-Z0-9 &@$]*[a-zA-Z0-9]$/;
  public static WITHOUT_SPACE: any = /^[a-z0-9\`\~\!\@\#\$\%\^\&\*\(\)\_\+\-\=\[\]\\\{\}\|\;\'\:\"\,\.\/\<\>\?]+$/i;
  public static SENTIMENT_VALUE = /^\-?[0-5]{1}$/;
  public static ONLY_NUMBER_WITH_HYPHEN: any = /^[0-9]+(-[0-9]+)+$/ || /^\d+$/;
  public static ONLY_NUMBER_UPTO_FIVE: any = /^[0-5]+$/;
  public static ALPHA_NUMERIC_WITH_DOT: any = /^[a-zA-Z0-9.]+$/;
  public static ALPHA_NUMERIC_WITH_UNDERSCORE_AND_APOSTROPHE: any = /^[a-zA-Z0-9\_\']+$/;
  public static ALPHA_NUMERIC_WITH_UNDERSCORE_AND_APOSTROPHE_AND_SPACES: any = /^(?![\s]+$)[a-zA-Z0-9\s\_\']*$/;
  public static PASSWORD_PATTERN: any = /^(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])[A-Za-z0-9#?!@$%^&*-]{8,}$/;
  public static ALPHA_WITH_SPECIAL_CHARACTERS: any = /^[A-Za-z#?!@$%^&*-_`~()|{}'" ]*$/;
  public static ALPHA_NUMERIC_WITH_SPACES: any = /^(?![\s.]+$)[a-zA-Z0-9\s.]*$/;
}
