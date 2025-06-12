window.addEventListener('load', function () {
    console.log("✅ unified-addon-cart.js loaded");

    const waitForElements = setInterval(() => {
      const form = document.querySelector('form[action^="/cart/add"]');
      const submitBtn = document.querySelector('[data-attach-addon]');
      const oneTime = document.querySelector('#one-time-support');
      const subscription = document.querySelector('#subscription-support');

      if (!form || !submitBtn || (!oneTime && !subscription)) {
        if (!form) console.warn("⚠️ Form not found");
        if (!submitBtn) console.warn("⚠️ Add to Cart button not found");
        if (!oneTime) console.warn("⚠️ One-time checkbox not found");
        if (!subscription) console.warn("⚠️ Subscription checkbox not found");
        return;
      }

      clearInterval(waitForElements);
      console.log("🧩 Unified addon script active");

      // (Keep rest of script below unchanged)


      function updateSupport() {
        if (subscription?.checked) {
          oneTime.checked = false;
          oneTime.disabled = true;
        } else {
          oneTime.checked = true;
          oneTime.disabled = false;
        }
      }

      subscription?.addEventListener('change', updateSupport);
      updateSupport();

      submitBtn.addEventListener('click', function (e) {
        e.preventDefault();

        const formData = new FormData(form);
        const baseId = parseInt(formData.get('id'));
        const quantityInput = form.querySelector('input[name="quantity"]');
        const qty = quantityInput ? parseInt(quantityInput.value) : 1;

        const items = [{ id: baseId, quantity: qty }];

        let addonVariantId = null;
        let sellingPlanId = null;

        if (subscription?.checked) {
          addonVariantId = 50847570035001;
          sellingPlanId = '691995312441';
        } else if (oneTime?.checked) {
          addonVariantId = 50810449920313;
        }

        if (addonVariantId) {
          const addonItem = {
            id: addonVariantId,
            quantity: qty
          };
          if (sellingPlanId) {
            addonItem.selling_plan = sellingPlanId;
          }
          items.push(addonItem);
        }

        console.log("🧪 Submitting to cart with items:", items);

        fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items })
        })
          .then(res => res.json())
          .then(() => window.location.href = '/cart')
          .catch(err => console.error("❌ Add to cart failed:", err));
      });
    }, 200);
  });